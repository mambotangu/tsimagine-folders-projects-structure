# Table of Contents
1. [Pre-Reqs](#Pre-Requisites)
2. [Repo](#Getting-the-Foundation-V2-Repo-to-the-customer)
3. [Terraform Variables](#Terraformtfvars)
4. [Customization](#Customize-Business-Code-App-Name-and-Networking)
5. [Execution](#Execution)

# Pre-Requisites

- Make sure the **GCP User** who runs the script has the following roles:
  - BILLING ACCOUNT ADMIN
  - ORG ADMIN
  - Folder Admin
  - ORG POLICY ADMIN
- Make sure the **GCP User** is in all the default mandatory groups:
  - gcp-admins@$DOMAIN
  - gcp-developers@$DOMAIN
  - gcp-devops@$DOMAIN
  - gcp-organization-admins@$DOMAIN
  - gcp-network-admins@$DOMAIN
  - gcp-billing-admins@$DOMAIN
  - gcp-security-admins@$DOMAIN
  - gcp-support-admins@$DOMAIN
  - gcp-auditors@$DOMAIN

# Terraform.tfvars

In each section (1-7) there is a **terraform.tfvars.example** file that needs to be copied to **terraform.tfvars** and filled-in with all the required information.

The `0-prep.sh` script consolidates all the changes needed into one script. Open this `0-prep.sh` script and edit the top section.

**NOTE**: It is recommended to commit the changes after editing this file and **before** executing the `auto_deploy.sh` script below. This allows for easy rollback if needed. 

The Domain, BILLING and ORG informations can get gathered on screen for you if you run the `get-gcp-infos.sh` script.

```bash
export DOMAIN="example.com"
export BILLING_ACCT="111111-222222-333333"
export ORGANIZATION="12345678901"

# Region to deploy the initial subnets
export REGION=US-CENTRAL1

export BUS_CODE=zzz
export APP_NAME=app1
```

The specific changes can be found in (the section below)[#customize-parameters]

Additionally, the group names can be altered by editing the names in the `0-prep.sh` script. 


# Execution

## Update 0-deploy.sh then run the script
This will set the app credentials required to execute:
```bash
nano 0-deploy.sh 
./0-deploy.sh
```

## Authenticate to Google
This will set the app credentials required to execute:
```bash
gcloud auth application-default login
```

## Deploy
To start the deployment:
```bash
./auto_deploy.sh
```

The menu will allow for selection of what to deploy.  

## Add code to Cloud Source Repository
```bash
gcloud config set project PROJECT_ID
csr/add_to_csr.sh
```

## Destroy
To destroy everything that was deployed.
```bash
./destroy.sh
```

To destroy from a specific step
```bash
./destroy.sh [Step Number]
```

# Customize Parameters

## Business Code and App Name

- business_code = A department ID (eg. 90210) - This helps ensure project global uniqueness
- app_name = The name of the app we are creating this structure for. (i.e.: coolgm)

- locals.tf files to change:
  - shared/locals.tf:  business_code    = "bc-change_me" # BC_CHANGE_ME  - Limit to 4-6 caracters
  - 4-dev/locals.tf:   app_name         = "app-change_me" # APP_CHANGE_ME - Limit to 6 characters
  - 4-dev/locals.tf:   business_code    = "bc-change_me" # BC_CHANGE_ME  - Limit to 4-6 caracters
  - 5-qa/locals.tf:    app_name         = "app-change_me" # APP_CHANGE_ME - Limit to 6 characters
  - 5-qa/locals.tf:    business_code    = "bc-change_me" # BC_CHANGE_ME  - Limit to 4-6 caracters
  - 6-uat/locals.tf:   app_name         = "app-change_me" # APP_CHANGE_ME - Limit to 6 characters
  - 6-uat/locals.tf:   business_code    = "bc-change_me" # BC_CHANGE_ME  - Limit to 4-6 caracters
  - 7-prod/locals.tf:  app_name         = "app-change_me" # APP_CHANGE_ME - Limit to 6 characters
  - 7-prod/locals.tf:  business_code    = "bc-change_me" # BC_CHANGE_ME  - Limit to 4-6 caracters
  - modules/bootstrap_setup/locals.tf:  resource_base_name  = "bc-change_me" # BC_CHANGE_ME - Limit to 4-6 caracters

- **Quick Search and Replace Example (Recursive):** (The `0-prep.sh` script does this replaces.
```bash
export BUS_CODE=T100
export APP_NAME=term
egrep -lRZ 'bc-change_me' --exclude="*.md" . | xargs sed -i "s/bc-change_me/$BUS_CODE/g"
egrep -lRZ 'app-change_me' --exclude="*.md" . | xargs sed -i "s/aapp-change_mepp1/$APP_NAME/g"
```

## Networking Region

If you need to change the default REGION for the Shared VPC.  It's all inthe JSON files.

- 3-shared/config/networking/*.json
  - dev.json:  "name" : "sb-p-shared-base-**us-west1**-net1",
  - dev.json:  "region": "**US-WEST1**",
  - dev.json:  "region": "**US-WEST1**",
  - prod.json:  "name" : "sb-p-shared-base-**us-west1**-net1",
  - prod.json: "region": "**US-WEST1**",
  - prod.json: "region": "**US-WEST1**",
  - qa.json:   "name" : "sb-p-shared-base-**us-west1**-net1",
  - qa.json:   "region": "**US-WEST1**",
  - qa.json:   "region": "**US-WEST1**",
  - uat.json:  "name" : "sb-p-shared-base-**us-west1**-net1",
  - uat.json:  "region": "**US-WEST1**",
  - uat.json:  "region": "**US-WEST1**",

- **Quick Search and Replace Example:**
```bash
export REGION=us-central1
egrep -lRZ 'US-WEST1' --exclude="*.md" . | xargs -0 -l sed -i -e "s/US-WEST1/$REGION/g"
egrep -lRZ 'us-west1' --exclude="*.md" . | xargs -0 -l sed -i -e "s/us-west1/$REGION/g"
```
