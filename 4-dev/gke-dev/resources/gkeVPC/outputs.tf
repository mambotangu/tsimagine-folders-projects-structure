output "gke_vpc_network_name" {
    value = module.network.gke_vpc_network_name
}

output "gke_vpc_subnet_name" {
    value = module.network.gke_vpc_subnet_name
}

output "pod_ip_range_name" {
    value = module.network.pod_ip_range_name
}

output "service_ip_range_name" {
    value = module.network.service_ip_range_name
}