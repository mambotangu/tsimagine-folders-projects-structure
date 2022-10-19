variable "network_name" {
    type = string
    description = "VPC Network"
    default = "gke-vpc"
}

variable "subnetwork_name" {
    type = string
    description = "Subnetwork Name"
    default = "gke-vpc-subnet"
}

variable "subnetwork_range" {
    type = string
    description = "Subnetwork Range"
    default = "10.120.224.0/21"
}

variable "subnetwork_pods" {
    type = string
    description = "Subnetwork Pods"
    default = "10.120.240.0/20"
}

variable "subnetwork_services" {
    type = string
    description = "Subnetwork Services"
    default = "10.120.232.0/21"
}

variable "region" {
    type = string
    description = "Region"
    default = "us-central1"
}

variable "project_name" {
    type = string
    description = "Project ID"
    default = "risk-dev-805"
}

variable "enable_cloud_nat" {
    type = bool
    description = "Enable CNAT or Not"
    default = true
}

variable "nat_ip_allocate_option" {
    type = string
    description = "NAT IP OPTION"
    default = "AUTO_ONLY"
}

variable "cloud_nat_address_count" {
  # https://cloud.google.com/nat/docs/overview#number_of_nat_ports_and_connections
  description = "the count of external ip address to assign to the cloud-nat object"
  type        = number
  default     = 1
}
