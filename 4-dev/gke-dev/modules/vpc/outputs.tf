output "gke_vpc_network_name" {
    value = resource.google_compute_network.network.name
}

output "gke_vpc_subnet_name" {
    value = resource.google_compute_subnetwork.subnetwork.name
}

output "pod_ip_range_name" {
    value = resource.google_compute_subnetwork.subnetwork.secondary_ip_range[0].range_name
}

output "service_ip_range_name" {
    value = resource.google_compute_subnetwork.subnetwork.secondary_ip_range[1].range_name
}