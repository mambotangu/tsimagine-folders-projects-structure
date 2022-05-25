### [1. bootstrap](./1-bootstrap/)

This stage executes the Bootstrap module which bootstraps an existing GCP organization.

The bootstrap step includes:

- The `prj-zzzz-b-seed` project, which contains:
  - Terraform state bucket
  - Custom Service Account used by Terraform to create new resources in GCP

After executing this step, you will have the following structure:

```
example-organization/
└── fldr-bootstrap
    └── prj-zzzz-b-tfseed
```
