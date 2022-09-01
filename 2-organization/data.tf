data "google_active_folder" "shared_folders" {
  depends_on = [ google_folder.folders ]
  display_name = "fldr-shared"
  parent       = "organizations/${data.terraform_remote_state.bootstrap.outputs.organization_id}"
}

data "google_active_folder" "rtrc_folders" {
  depends_on = [ google_folder.folders ]
  display_name = "fldr-rtrc"
  parent       = "organizations/${data.terraform_remote_state.bootstrap.outputs.organization_id}"
}