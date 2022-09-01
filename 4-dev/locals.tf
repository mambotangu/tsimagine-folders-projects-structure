locals {
  env               = "d"
  app_name          = "rrc-margin" # APP_CHANGE_ME - Limit to 6 characters
  business_code     = "bc-change_me"  # BC_CHANGE_ME  - Limit to 4-6 caracters
  rrc-margin_project_name = "prj-${local.env}-${local.app_name}"

  rrc-margin_service_apis = [
    "compute.googleapis.com"
  ]
  project_terraform_labels = {
    "env" = "fldr-rtrc-dev"
  }

  admin_roles = [
    "roles/editor",
    "roles/resourcemanager.projectIamAdmin",
    "roles/storage.objectAdmin"
  ]

  developer_roles = [
    "roles/editor",
    "roles/storage.objectAdmin"
  ]

  devops_roles = [
    "roles/editor",
    "roles/storage.objectAdmin"
  ]

  has_sa = true

}
