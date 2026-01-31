# IAM Role for the EC2 Instance
resource "aws_iam_role" "eb_instance_role" {
  name = var.instance_role_name

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
  name = var.instance_profile_name
  role = aws_iam_role.eb_instance_role.name
}
