locals {
  env               = "p"
  app_name          = "rrc-margin" # APP_CHANGE_ME - Limit to 6 characters
  business_code     = "bc-change_me"  # BC_CHANGE_ME  - Limit to 4-6 caracters
  rrc-margin_project_name = "prj-${local.env}-${local.app_name}"

  rrc-margin_service_apis = [
    "compute.googleapis.com"
  ]
  project_terraform_labels = {
    "env" = "fldr-rtrc-prod"
  }

  admin_roles = [
    "roles/viewer"
  ]

  developer_roles = [
    "roles/compute.viewer",
    "roles/container.viewer",
    "roles/logging.viewer",
    "roles/dataproc.viewer",
    "roles/bigquery.dataViewer",
    "roles/bigquery.resourceViewer",
    "roles/cloudfunctions.viewer",
    "roles/monitoring.viewer"
  ]

  devops_roles = [
    "roles/compute.viewer",
    "roles/container.viewer",
    "roles/logging.viewer",
    "roles/dataproc.viewer",
    "roles/bigquery.dataViewer",
    "roles/bigquery.resourceViewer",
    "roles/cloudfunctions.viewer",
    "roles/monitoring.viewer"
  ]
}
