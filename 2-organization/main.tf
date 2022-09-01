resource "google_folder" "folders" {
  for_each = toset(local.folders)

  display_name = each.value
  parent       = "organizations/${data.terraform_remote_state.bootstrap.outputs.organization_id}"
}

resource "google_folder" "shared_sub_folders" {
  depends_on = [ google_folder.folders ]
  for_each = toset(["fldr-shared-vpc", "fldr-common"])

  display_name = each.value
  parent       = data.google_active_folder.shared_folders.name
}

resource "google_folder" "rtrc_sub_folders" {
  depends_on = [ google_folder.folders ]
  for_each = toset(["fldr-rtrc-dev", "fldr-rtrc-uatprod", "fldr-rtrc-prod", "fldr-rtrc-sandbox"])

  display_name = each.value
  parent       = data.google_active_folder.rtrc_folders.name
}

# module "organization_policies" {
#   source = "../modules/organization_policies"

#   organization_id = data.terraform_remote_state.bootstrap.outputs.organization_id
# }

# module "org_level_iam_group_bindings" {
#   source               = "../modules/iam/org-iam"
#   domain               = var.domain
#   org_id               = var.organization_id
#   billing_admin_group  = var.billing_admin_group
#   org_admin_group      = var.org_admin_group
#   network_admin_group  = var.network_admin_group
#   support_admin_group  = var.support_admin_group
#   auditor_group        = var.auditor_group
#   security_admin_group = var.security_admin_group
# }
