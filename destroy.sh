#!/bin/bash

terraform -chdir=7-prod destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 7"
  exit 1
else
  echo "Prod resources destroyed. "
fi

echo "" > ./7-prod/provider.tf

terraform -chdir=6-uat destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 6"
  exit 1
else
  echo "UAT resources destroyed. "
fi

echo "" > ./6-uat/provider.tf

terraform -chdir=5-qa destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 5"
  exit 1
else
  echo "QA resources destroyed. "
fi

echo "" > ./5-qa/provider.tf

terraform -chdir=4-dev destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 4"
  exit 1
else
  echo "Dev resources destroyed. "
fi

echo "" > ./4-dev/provider.tf

terraform -chdir=3-shared destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 3"
  exit 1
else
  echo "Shared resources destroyed. "
fi

echo "" > ./3-shared/provider.tf

terraform -chdir=2-organization destroy --auto-approve -var-file=terraform.tfvars

if [ $? != 0 ]; then
  echo "Error on step 2"
  exit 1
else
  echo "Organization resources destroyed. "
fi

echo "" > ./2-organization/provider.tf

echo "" > ./1-bootstrap/provider.tf

terraform -chdir=1-bootstrap init -force-copy

if [ $? != 0 ]; then
  echo "Error on step 1 migrating state"
  exit 1
else
  echo "Bootstrap state migrated. Destroying resources... "
fi

terraform -chdir=1-bootstrap destroy -var-file=terraform.tfvars --auto-approve;

if [ $? != 0 ]; then
  echo "Error on step 1"
  exit 1
else
  echo "Bootstrap resources destroyed. "
  exit 0
fi