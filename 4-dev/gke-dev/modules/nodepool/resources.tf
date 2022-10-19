data "terraform_remote_state" "cluster" {
  backend = "gcs"
  config = {
    bucket  = "bkt-b-tfstate-6941"
    prefix  = "tf_state_dev/gke-cluster-state"
  }
}

resource "google_container_node_pool" "node_pool" {
  name     = "private-pool"
  location = var.location
  project = var.project_name
  cluster = "${data.terraform_remote_state.cluster.outputs.gke_cluster_name}"
  node_count = var.gke_num_nodes
  node_config {
    preemptible = var.enable_preemptible_machines
    machine_type = var.machine_type
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}