# S3 Bucket to store the app versions
resource "aws_s3_bucket" "app_bucket" {
  bucket = "moonpig-tech-test-bucket-${random_id.id.hex}"
}

resource "random_id" "id" {
  byte_length = 4
}
