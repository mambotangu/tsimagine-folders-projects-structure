### [3. Shared](./3-shared/)

This will create tree projects underneath the shared folder:

```
example-organization
└── fldr-shared
    ├── prj-zzzz-s-log-mon
    └── prj-zzzz-s-svpc
    └── prj-zzzz-s-secrets-kms

```

**Notes**:

- For billing data, a BigQuery dataset is created with permissions attached, however you will need to configure a billing export [manually](https://cloud.google.com/billing/docs/how-to/export-data-bigquery), as there is no easy way to automate this at the moment.

#### Logging

- The logging strategy of this foundation is around VPC Flow Logs. Each VPC's and Subnets under the Shared VPCs project send their logs in a Sync hosted in a bucket in the log-mon shared project.

#### Monitoring

- Under each environment folder, a project is created per environment (`dev`, `prod`, `uat` & `qa`).
  Please note that creating the [workspace and linking projects](https://cloud.google.com/monitoring/workspaces/create) can currently only be completed through the Cloud Console.

- If you have strong IAM requirements for these monitoring workspaces, it is worth considering creating these at a more granular level, such as per business unit or per application.

#### Networking

- Under the shared folder one project is created which contains 4 vpc networks, one per environment (`dev`, `prod`, `qa` & `uat`) which is intended to be used as a [Shared VPC Host project](https://cloud.google.com/vpc/docs/shared-vpc) for all projects in the foundation. The underlying TF modules for creating the networking are complex and thus configuration should be done using the json schema's provided in the "config" folder under shared/networking.

### Networks

- VPC networks are deployed per environment with baseline firewall rules and cloud NAT'ing in place. Each network has it's configuration stored in a json schema which can be updated and the terraform re-deployed to customize the network attributes.

### Secrets and KMS

- There is nothing put in place regarding Secrets Management and KMS in this foundation beside a host project dedicated to this task. Both APIs are enabled at project creation.
