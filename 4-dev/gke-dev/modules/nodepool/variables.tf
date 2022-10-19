variable "location" {
    type = string
    description = "Location of Cluster"
}

variable "gke_num_nodes" {
    type = number
    description = "Number of Compute Nodes"
}

variable "enable_preemptible_machines" {
    type = bool
    description = "Enable or disable preemptible machines"
}

variable "machine_type" {
    type = string
    description = "Machine type for GKE Compute nodes"
}

variable "project_name" {
    type = string
    description = "Project Id"
}