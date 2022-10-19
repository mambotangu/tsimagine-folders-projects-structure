variable "location" {
    type = string
    description = "Location of Cluster"
    default = "us-central1"
}

variable "gke_num_nodes" {
    type = number
    description = "Number of Compute Nodes"
    default = 1
}

variable "enable_preemptible_machines" {
    type = bool
    description = "Enable or disable preemptible machines"
    default = false
}

variable "machine_type" {
    type = string
    description = "Machine type for GKE Compute nodes"
    default = "n1-standard-1"
}

variable "project_name" {
    type = string
    default = "risk-dev-805"
}