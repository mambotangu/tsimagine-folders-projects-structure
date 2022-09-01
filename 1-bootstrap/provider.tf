terraform {
  backend "gcs" {
    bucket = "bkt-b-tfstate-9336"
    prefix = "tf_state_bootstrap"
  }
}
