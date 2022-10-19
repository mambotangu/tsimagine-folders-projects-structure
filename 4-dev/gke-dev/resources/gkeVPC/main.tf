module "network" {
    source = "../../modules/GkeVpcNetwork-Module"
    project_name = var.project_name
    region = var.region
    network_name = var.network_name
    subnetwork_name = var.subnetwork_name
    subnetwork_range = var.subnetwork_range
    subnetwork_pods = var.subnetwork_pods
    subnetwork_services = var.subnetwork_services
    enable_cloud_nat = var.enable_cloud_nat
    nat_ip_allocate_option = var.nat_ip_allocate_option
    cloud_nat_address_count = var.cloud_nat_address_count
}