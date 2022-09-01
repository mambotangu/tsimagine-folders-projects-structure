# data "terraform_remote_state" "bootstrap" {
#   backend = "gcs"
#   config = {
#     bucket  = "bkt-b-tfstate-9336" ## To Be Changed
#     prefix  = "tf_state_organization/"
#   }
# }