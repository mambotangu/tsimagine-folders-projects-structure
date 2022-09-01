data "terraform_remote_state" "bootstrap1" {
  backend = "gcs"
  config = {
   bucket  = "bkt-b-tfstate-9336" ## To Be change
    #bucket  = module.bootstrap_setup.bucket
    prefix  = "tf_state_organization/"
  }
}