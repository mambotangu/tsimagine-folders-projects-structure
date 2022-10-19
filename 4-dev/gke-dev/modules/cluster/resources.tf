data "terraform_remote_state" "network" {
  backend = "gcs"
  config = {
    bucket  = "bkt-b-tfstate-6941"
    prefix  = "tf_state_dev/gke-network-state"
  }
}

resource "google_container_cluster" "primary" {
  name     = var.gke_cluster_name
  project  = var.project_name
  location = var.gke_cluster_region
  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1
  network = "${data.terraform_remote_state.network.outputs.gke_vpc_network_name}"
  subnetwork = "${data.terraform_remote_state.network.outputs.gke_vpc_subnet_name}"
  ip_allocation_policy {
    cluster_secondary_range_name = "${data.terraform_remote_state.network.outputs.pod_ip_range_name}"
    services_secondary_range_name = "${data.terraform_remote_state.network.outputs.service_ip_range_name}"
  }
  private_cluster_config {
      enable_private_nodes = true
      enable_private_endpoint = false
      master_ipv4_cidr_block = "10.5.0.0/28"
  }
}