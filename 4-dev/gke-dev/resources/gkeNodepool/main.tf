module "nodepool" {
    source = "../../modules/GkeNodePool-Module"
    location = var.location
    gke_num_nodes = var.gke_num_nodes
    enable_preemptible_machines = var.enable_preemptible_machines
    machine_type = var.machine_type
    project_name = var.project_name
}