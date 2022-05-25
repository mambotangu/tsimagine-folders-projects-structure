### [Prereqs]

1. Permissions
2. Application default credentials
3. Groups
   3a. prep.js
   3b. DWD (domain wide delegation)
   3c. 0.5-prep.sh

# PERMISSIONS

Make sure the **GCP User** who runs the Foundation scripts has the following roles at the org level:

- Billing Account User
- Org Admin
- Folder Admin
- Org Policy Admin
- Project Creator
- Compute Shared VPC Admin
- Logging Admin
- Storage Admin

# Application default credentials

These scripts rely on Application default credentials. Please run

```bash
gcloud auth application-default login
```

and log in with your SADA credentials.

# Groups

Currently, GCP offers absolutely no possible means of fully automating group creation end to end in Google workspace. The two options you are left with for automating group creation as much as possible are:

- Creating app credentials for the group creation script and authorizing it in the browser
- Enabling domain wide delegation for a service account in the google admin console (this is the method we'll use)

Because step 1-bootstrap will attempt to create IAM bindings for groups in the GCP organization, these groups MUST exist prior to running step 1. The **`prep.js`** and **`0.5-prep.sh`** scripts should help automate most of these steps.

The **prep.js** & **0.5-prep.sh** scripts will perform all the neccessary steps to prep the environment for applying the Terraform. Make sure that any values marked CHANGE_ME are changed to align with your specific environment.

- prep.js

a node script that will help you set up a project, service account and credentials for automating group creation. It is contained in the prepApp folder. It requires an org ID in the .env file.

```env
ORGANIZATION = 123456789
```

once you have an org ID in the .env file, run

```bash
npm i
node prep.js
```

from inside the prepApp folder

- Domain Wide Delegation

You will need to enable domain wide delegation for the service account created in prep.js so it can create groups for us.

Go to : https://admin.google.com/ac/owl and scroll to the bottom and click “MANAGE DOMAIN WIDE DELEGATION”.

![](img/dwd_1.png)

Click “Add new”

![](img/dwd_2.png)

You can find your OAuth client id on the service accounts page of the project created in the previous step. It’s on the far right.

![](img/dwd_3.png)

Paste the client ID in the Client ID field in Google admin. The OAuth scope we need is: https://www.googleapis.com/auth/admin.directory.group

![](img/dwd_4.png)

Click “AUTHORIZE” when you have filled in the client ID and the single auth scope.

You are now ready to edit and run 0.5-prep.sh

- 0.5-prep.sh

Update the values in the 0.5-prep.sh script that say CHANGE_ME and run the script. If you get a permission error make sure the script is executable. The values will appear in the script similar to what's below

```bash
# Update these variables IN THE PREP SCRIPTS per your environment.
#
export ADMIN_EMAIL="CHANGE_ME" # The email address of the user deploying the foundation
export DOMAIN="CHANGE_ME"       # Your User verified Domain for GCP
export BILLING_ACCT="CHANGE_ME" # Your GCP BILLING ID (SADA Sub-Account or Direct ID);
export ORGANIZATION="CHANGE_ME" # Your GCP ORG ID
export REGION=US-WEST1          # Region to deploy the initial subnets
export USE_BUS_CODE="TRUE"      # Set to FALSE to remove the Business Code requirement
export BUS_CODE=zzzz            # The Department code or cost center associated with this Foudnation ; Leave like this if you've set USE_BUS_CODE to FALSE ;
export APP_NAME=app1            # Short name of your workload

```

The specific changes can be found in (the section below)[#customize-parameters]

Additionally, the group names can be altered by editing the names in the `prep.js` script.

This will create groups and update your TF values.

```bash
nano 0.5-prep.sh
./0.5-prep.sh
```
