variable "instance_role_name" {
  description = "Name for the EB instance role"
  type        = string
  default     = "moonpig-eb-instance-role"
}

variable "instance_profile_name" {
  description = "Name for the EB instance profile"
  type        = string
  default     = "moonpig-eb-instance-profile"
}

variable "app_name" {
  description = "Elastic Beanstalk application name"
  type        = string
  default     = "moonpig-cards-service"
}

variable "env_name" {
  description = "Elastic Beanstalk environment name"
  type        = string
  default     = "moonpig-service-dev"
}
