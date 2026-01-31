provider "aws" {
  region = "eu-west-1"
}

# Find the latest Node.js 20 solution stack automatically
data "aws_elastic_beanstalk_solution_stack" "nodejs_latest" {
  most_recent = true
  name_regex  = "^64bit Amazon Linux 2023 (.*) running Node.js 20$"
}

# 1. S3 Bucket to store your app versions
resource "aws_s3_bucket" "app_bucket" {
  bucket = "moonpig-tech-test-bucket-${random_id.id.hex}"
}

resource "random_id" "id" {
  byte_length = 4
}

# 2. IAM Role for the EC2 Instance
resource "aws_iam_role" "eb_instance_role" {
  name = "moonpig-eb-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Attach standard Beanstalk policies for the instance
resource "aws_iam_role_policy_attachment" "web_tier" {
  role       = aws_iam_role.eb_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_instance_profile" "eb_instance_profile" {
  name = "moonpig-eb-instance-profile"
  role = aws_iam_role.eb_instance_role.name
}

# 3. Elastic Beanstalk Application
resource "aws_elastic_beanstalk_application" "app" {
  name        = "moonpig-cards-service"
  description = "Backend service for Moonpig cards"
}

# 4. Elastic Beanstalk Environment
resource "aws_elastic_beanstalk_environment" "env" {
  name                = "moonpig-service-dev"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = data.aws_elastic_beanstalk_solution_stack.nodejs_latest.name

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_instance_profile.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "8081"
  }
}

output "eb_url" {
  value = aws_elastic_beanstalk_environment.env.cname
}
