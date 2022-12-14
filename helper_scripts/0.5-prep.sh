#!/bin/bash
clear

####
# **Update these variables
####



# Update these variables per your GCP environment
export DOMAIN="tradingscreen.com"       # Your User verified Domain for GCP
export BILLING_ACCT="0192E9-F5AD31-237B24" # Your GCP BILLING ID (SADA Sub-Account or Direct ID);
export ORGANIZATION="868805561528" # Your GCP ORG ID
export REGION=US-EAST1          # Region to deploy the initial subnets
export USE_BUS_CODE="FALSE"      # Set to FALSE to remove the Business Code requirement
export BUS_CODE=zzzz            # The Department code or cost center associated with this Foudnation ; Leave like this if you've set USE_BUS_CODE to FALSE ; 
export APP_NAME=rrc-margin            # Short name of your workload


###
# Build some variables
# NOTE: These groups should already exist!
###
export BUS_CODE_L=$(echo "$BUS_CODE" | tr '[:upper:]' '[:lower:]')
export APP_NAME_L=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
export REGION_L=$(echo "$REGION" | tr '[:upper:]' '[:lower:]')


# Example: grp-gcp-t101-prj-term-admins@cyberdyne.com
export ADMINS="gcp-$APP_NAME-admins@$DOMAIN"
#export DEVELOPERS="grp-gcp-$BUS_CODE_L-prj-$APP_NAME_L-developers@$DOMAIN"
export DEVELOPERS="gcp-$APP_NAME-developers@$DOMAIN"
export DEV_OPS="gcp-$APP_NAME-devops@$DOMAIN"
#
export O_ADMINS="gcp-organization-admins@$DOMAIN"
export N_ADMINS="gcp-network-admins@$DOMAIN"
export B_ADMINS="gcp-billing-admins@$DOMAIN"
export SEC_ADMINS="gcp-security-admins@$DOMAIN"
export SUP_ADMINS="gcp-support-admins@$DOMAIN"
export AUDITORS="gcp-auditors@$DOMAIN"


echo 
echo ... Make sure the following groups already exist
echo
echo $ADMINS
echo $DEVELOPERS
echo $DEV_OPS
echo $B_ADMINS
echo $O_ADMINS
echo $N_ADMINS
echo $SUP_ADMINS
echo $AUDITORS
echo $SEC_ADMINS
echo
echo ...
echo 
echo  "Press a key when ready. Next steps will not be idempotent"
read  -n 1


###
# Determine architecture of execution context
###
echo "*** Checking system"

if [[ $(uname -a | grep Linux) ]]
then
  echo "*** Linux machine detected"
  echo
  export MAC_OS="FALSE"
elif [[ $(uname -a | grep Darwin) ]]
then
  echo "*** Macintosh machine detected"
  echo
  export MAC_OS="TRUE"
else
  echo "*** Could not determine system architecture. Scripts will use Linux variants in this case."
fi


###
# Replace default values
###
echo "*** Replacing Business Code"
echo
if [[ $USE_BUS_CODE == "TRUE" ]]
then
  if [ $MAC_OS == "TRUE" ]; then
    egrep -lRZ 'bc-change_me' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs sed -i -e "s/bc-change_me/$BUS_CODE_L/g"
  else
    egrep -lRZ 'bc-change_me' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/bc-change_me/$BUS_CODE_L/g"    
  fi
elif [[ $USE_BUS_CODE == "FALSE" ]]
then
  if [ $MAC_OS == "TRUE" ]
  then
    egrep -lRZ '\$\{local.business_code}-' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ |  xargs sed -i -e 's/${local.business_code}-//g'
    egrep -lRZ '\$\{local.business_code}_' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ |  xargs sed -i -e 's/${local.business_code}_//g'
    sed -i -e 's/${local.resource_base_name}-//g' ../modules/bootstrap_setup/locals.tf
  else
    egrep -lRZ '\$\{local.business_code}-' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ |  xargs -r -0 -l sed -i -e 's/${local.business_code}-//g'
    egrep -lRZ '\$\{local.business_code}_' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ |  xargs -r -0 -l sed -i -e 's/${local.business_code}_//g'    
    sed -i -e 's/${local.resource_base_name}-//g' ../modules/bootstrap_setup/locals.tf
  fi
else
  echo
  echo ":\( Invalid Business Code Usage value, exiting."
  echo
  exit 0;
fi


echo "*** Replacing App Name"
echo
if [ $MAC_OS == "TRUE" ]
then
  egrep -lRZ 'app-change_me' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs sed -i -e "s/app-change_me/$APP_NAME_L/g"
else
  egrep -lRZ 'app-change_me' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/app-change_me/$APP_NAME_L/g"
fi


echo "*** Replacing Domain and Org"
echo
if [ $MAC_OS == "TRUE" ]
then
  egrep -lRZ 'example.com' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | LC_ALL=C xargs sed -i "" -e "s/example\.com/$DOMAIN/g"
  egrep -lRZ '000000000000' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | LC_ALL=C xargs sed -i "" -e "s/000000000000/$ORGANIZATION/g"
else
  egrep -lRZ 'example.com' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/example\.com/$DOMAIN/g"
  egrep -lRZ '000000000000' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/000000000000/$ORGANIZATION/g"
fi


echo "*** Replacing Region"
echo
if [ $MAC_OS == "TRUE" ]
then
  egrep -lRZ 'US-WEST1' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs sed -i -e "s/US-WEST1/$REGION/g" #does not throw error
  egrep -lRZ 'us-west1' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | LC_ALL=C xargs sed -i "" -e "s/us-west1/$REGION_L/g" #throws error
else
  egrep -lRZ 'US-WEST1' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/US-WEST1/$REGION/g"
  egrep -lRZ 'us-west1' --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../ | xargs -r -0 -l sed -i -e "s/us-west1/$REGION_L/g"
fi


echo "*** Building .tfvars files"
echo
######
## 1-bootstrap
######
cat <<EOF > ../1-bootstrap/terraform.tfvars
billing_account = "$BILLING_ACCT"
organization_id = "$ORGANIZATION"
users           = ["group:$O_ADMINS"]
EOF


######
## 2-organization
######
cat <<EOF > ../2-organization/terraform.tfvars
domain = "$DOMAIN"
organization_id = "$ORGANIZATION"
billing_admin_group  = "$B_ADMINS"
org_admin_group      = "$O_ADMINS"
network_admin_group  = "$N_ADMINS"
support_admin_group  = "$SUP_ADMINS"
auditor_group        = "$AUDITORS"
security_admin_group = "$SEC_ADMINS"
EOF


######
## 3-shared
######
cat <<EOF > ../3-shared/terraform.tfvars
billing_account = "$BILLING_ACCT"

##Groups are created in Google admin and must exist prior to deploying this step.###
billing_admin_group_email = "$B_ADMINS"
network_user_groups = [
  "$N_ADMINS",
  "$DEVELOPERS"
]
EOF


######
## 4-dev
######
cat <<EOF > ../4-dev/terraform.tfvars
billing_account = "$BILLING_ACCT"

##Groups are created in Google admin and must exist prior to deploying this step.###
admin_group_name     = "$ADMINS"
developer_group_name = "$DEVELOPERS"
devops_group_name    = "$DEV_OPS"
EOF


######
## 5-uatprod
######
cat <<EOF > ../5-uatprod/terraform.tfvars
billing_account = "$BILLING_ACCT"

##Groups are created in Google admin and must exist prior to deploying this step.###
admin_group_name     = "$ADMINS"
developer_group_name = "$DEVELOPERS"
devops_group_name    = "$DEV_OPS"
EOF


######
## 6-prod
######
cat <<EOF > ../6-prod/terraform.tfvars
billing_account ="$BILLING_ACCT"

##Groups are created in Google admin and must exist prior to deploying this step.###
admin_group_name     = "$ADMINS"
developer_group_name = "$DEVELOPERS"
devops_group_name    = "$DEV_OPS"
EOF


echo "Done..."
echo
