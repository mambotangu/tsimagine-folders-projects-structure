variable "network_name" {
    type = string
    description = "VPC Network"
    default = ""
}

variable "subnetwork_name" {
    type = string
    description = "Subnetwork Name"
    default = ""
}

variable "subnetwork_range" {
    type = string
    description = "Subnetwork Range"
    default = ""
}

variable "subnetwork_pods" {
    type = string
    description = "Subnetwork Pods"
    default = ""
}

variable "subnetwork_services" {
    type = string
    description = "Subnetwork Services"
    default = ""
}

variable "region" {
    type = string
    description = "Region"
    default = ""
}

variable "project_name" {
    type = string
    description = "Project ID"
    default = ""
}

variable "enable_cloud_nat" {
    type = bool
    description = "Enable CNAT or Not"
}

variable "nat_ip_allocate_option" {
    type = string
    description = "NAT IP OPTION"
}

variable "cloud_nat_log_config_filter" {
    default = null
}

variable "cloud_nat_min_ports_per_vm" {
  description = "Minimum number of ports allocated to a VM from this NAT."
  type        = number
  default     = 64
}

variable "cloud_nat_tcp_transitory_idle_timeout_sec" {
  # https://cloud.google.com/nat/docs/overview#specs-timeouts
  description = "Timeout in seconds for TCP transitory connections."
  type        = number
  default     = 30
}

variable "cloud_nat_address_count" {
  # https://cloud.google.com/nat/docs/overview#number_of_nat_ports_and_connections
  description = "the count of external ip address to assign to the cloud-nat object"
  type        = number
}
