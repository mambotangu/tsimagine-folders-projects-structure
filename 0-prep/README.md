### [Getting Started]

## Identity
```
cd ~/proserv-foundations/0-prep/createGroups
cp .envExample .env
nano .env
===> Fill-in the missing info
cd ~/proserv-foundations/0-prep/prepApp
npm i
node main.js
```

Answer the prompts.
Once you're done you can move on to the 0.5-prep.sh script.

## Prep
```
cd ~/proserv-foundations/helper_scripts
chmod 755 *
nano 0.5-prep.sh
===> Fill-in the missing info at the top (lines 11 to 17)
./0.5-prep.sh
```

## Deployment
```
cd ~/proserv-foundations
helper_scripts/auto_deploy.sh
```