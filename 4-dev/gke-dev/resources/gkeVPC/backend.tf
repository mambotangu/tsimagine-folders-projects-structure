terraform {
 backend "gcs" {
   bucket  = "bkt-b-tfstate-6941"
   prefix  = "tf_state_dev/gke-network-state"
 }
}