module "cluster" {
    source = "../../modules/GkeCluster-Module"
    gke_cluster_name = var.gke_cluster_name
    gke_cluster_region = "us-central1"
    project_name = var.project_name
}