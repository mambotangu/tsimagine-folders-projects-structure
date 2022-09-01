module "rrc-margin_prod_project" {
  source             = "../modules/projects"
  name               = local.rrc-margin_project_name
  project_id         = local.rrc-margin_project_name
  services           = local.rrc-margin_service_apis
  billing_account    = var.billing_account
  #folder_id       = data.terraform_remote_state.bootstrap1.outputs.rtcr_sub_folders.fldr-rtrc-prod.name
  folder_id = var.folder_id
  labels             = local.project_terraform_labels
  has_sa             = true
  sa_account_id      = local.rrc-margin_project_name
  is_service_project = true
  #host_project_id    = trimprefix(data.terraform_remote_state.shared.outputs.svpc_prj_id, "projects/")
  host_project_id = var.host_project_id
}

module "rrc-margin_prod_admin_iam" {
  source           = "../modules/iam/projects-iam"
  project_id       = trimprefix(module.rrc-margin_prod_project.project_id, "projects/")
  admin_roles      = local.admin_roles
  admin_group_name = var.admin_group_name
}

module "rrc-margin_prod_developer_iam" {
  source               = "../modules/iam/projects-iam"
  project_id           = trimprefix(module.rrc-margin_prod_project.project_id, "projects/")
  developer_roles      = local.developer_roles
  developer_group_name = var.developer_group_name
}

module "rrc-margin_prod_devops_iam" {
  source            = "../modules/iam/projects-iam"
  project_id        = trimprefix(module.rrc-margin_prod_project.project_id, "projects/")
  devops_roles      = local.devops_roles
  devops_group_name = var.devops_group_name
}
