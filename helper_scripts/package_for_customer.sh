#!/bin/bash
#
[[ ! -f ../sada-foundation.tgz ]] || rm -f ../sada-foundation.tgz
[[ -d sada-foundation ]] || mkdir sada-foundation
mkdir sada-foundation/1-bootstrap
mkdir sada-foundation/2-organization
mkdir sada-foundation/3-shared
mkdir sada-foundation/4-dev
mkdir sada-foundation/5-qa
mkdir sada-foundation/6-uat
mkdir sada-foundation/7-prod
mkdir sada-foundation/modules
#
echo
echo Preparing......
echo
cd 1-bootstrap ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/1-bootstrap
cd ../2-organization ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/2-organization
cd ../3-shared ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/3-shared
cd ../4-dev ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/4-dev
cd ../5-qa ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/5-qa
cd ../6-uat ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/6-uat
cd ../7-prod ; cp -R `ls -A | grep -v ".terraform"` ../sada-foundation/7-prod
cd ../modules ; cp -R `ls -A | grep -v "archived"` ../sada-foundation/modules
cd ..
cp -R csr ./sada-foundation/
mkdir ./sada-foundation/docs
mkdir ./sada-foundation/docs/img
cp ./docs/getting_started_fast.md ./sada-foundation/docs/
cp -r ./docs/img/* ./sada-foundation/docs/img/
cp .gitignore ./sada-foundation/
cp 0-prep.sh ./sada-foundation/
cp 0.5-prep.sh ./sada-foundation/
cp auto_deploy.sh ./sada-foundation/
cp create_groups.py ./sada-foundation/
cp destroy.sh ./sada-foundation/
cp get-gcp-infos.sh ./sada-foundation/
cp README.md ./sada-foundation/
#
echo Packaging......
echo
tar czf ../sada-foundation.tgz sada-foundation
rm -rf sada-foundation
#
export c_dir=$(pwd)
export p_dir="$(dirname "$c_dir")"
echo "Foundation Packaged And Ready For Customer!"
echo
echo "Package Location: $p_dir"
echo "Package Name: sada-foundation.tgz"
echo
#