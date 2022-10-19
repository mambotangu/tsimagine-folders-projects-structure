locals {
  ## the following locals modify resource creation behavior depending on var.nat_ip_allocate_option
  enable_cloud_nat        = var.enable_cloud_nat == true ? 1 : 0
  cloud_nat_address_count = var.nat_ip_allocate_option != "AUTO_ONLY" ? var.cloud_nat_address_count * local.enable_cloud_nat : 0
  nat_ips                 = var.nat_ip_allocate_option != "AUTO_ONLY" ? google_compute_address.ip_address.*.self_link : null
}

resource "google_compute_network" "network" {
  name                    = var.network_name
  routing_mode            = "GLOBAL"
  auto_create_subnetworks = false
  project = var.project_name
}

resource "google_compute_subnetwork" "subnetwork" {
  name                     = var.subnetwork_name
  project                  = var.project_name
  ip_cidr_range            = var.subnetwork_range
  network                  = google_compute_network.network.self_link
  region                   = var.region
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "gke-pods-1"
    ip_cidr_range = var.subnetwork_pods
  }

  secondary_ip_range {
    range_name    = "gke-services-1"
    ip_cidr_range = var.subnetwork_services
  }
}

resource "google_compute_router" "router" {
  count   = local.enable_cloud_nat
  project = var.project_name
  name    = var.network_name
  network = google_compute_network.network.name
  region  = var.region
}

resource "google_compute_address" "ip_address" {
  project = var.project_name
  count  = local.cloud_nat_address_count
  name   = "nat-external-address-${count.index}"
  region = var.region
}

resource "google_compute_router_nat" "nat_router" {
  count                              = local.enable_cloud_nat
  name                               = var.network_name
  router                             = google_compute_router.router.0.name
  region                             = var.region
  project                            = var.project_name
  nat_ip_allocate_option             = var.nat_ip_allocate_option
  nat_ips                            = local.nat_ips
  min_ports_per_vm                   = var.cloud_nat_min_ports_per_vm
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  tcp_transitory_idle_timeout_sec    = var.cloud_nat_tcp_transitory_idle_timeout_sec

  log_config {
    enable = var.cloud_nat_log_config_filter == null ? false : true
    filter = var.cloud_nat_log_config_filter == null ? "ALL" : var.cloud_nat_log_config_filter
  }
}
