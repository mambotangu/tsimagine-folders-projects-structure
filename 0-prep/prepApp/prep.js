#! /usr/bin/env node

require("dotenv").config({path: '../createGroups/.env'});
const fs = require('fs')
const exec = require('child_process').exec;
const {google} = require('googleapis');
const replace = require('replace-in-file');

// We will wrap all of our shell (gcloud) commands in this async function to ensure they always return before we continue
function shell_cmd() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
   }
}
// Kick off looking for the foundation workspace project in the target org defined in the .env file
function Start() {
    const start = new shell_cmd();
    console.log("**Checking to see if there's an existing google workspace project")
    start.execCommand('gcloud projects list --format=json --filter=foundation-workspace').then(res=> {
        const projects = JSON.parse(res)
        for(let i = 0; i<projects.length; i++){
            if(projects[i].parent.id == process.env.ORGANIZATION) {
                console.log("**foundation-workspace project found. Enabling the needed API's...")
                enableAdmin(projects[i].projectId)
                return
            }else{
                console.log('**project not in target org')
            }
        }
        console.log('***No foundation workspace project found. Creating project...')
        createWorkspaceProject()
    }).catch(err=> {
        console.log("**Error querying for projects >>>", err);
        return "Error looking for project"
    })
}


// If the project doesn't exist, create it.
function createWorkspaceProject() {
    const project = new shell_cmd()
    var val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);
    String(val)
    project.execCommand('gcloud projects create foundation-workspace-'+`${val}`+' --name=foundation-workspace --organization='+process.env.ORGANIZATION+' --labels=type=foundation').then(res => {
        console.log('res', res)
        console.log('**Project created. Enabling API\'s')
        enableAdmin('foundation-workspace-'+val)
    }).catch(err => {
        console.log('**Error creating project ',err)
    })
}

// Once project is created, enable API's
function enableAdmin(projectId) {
    const enableAdmin = new shell_cmd()
    enableAdmin.execCommand('gcloud services enable admin.googleapis.com --project='+projectId).then(res => {
        console.log('**Admin API enabled. Enabling IAM API')
        enableIAM(projectId)
    }).catch(err => {
        console.log('**There was a problem enabling the admin API ', err)
        return 'error enabling the admin API '
    })
}

function enableIAM(projectId) {
    const enableIAM = new shell_cmd()
    enableIAM.execCommand('gcloud services enable iam.googleapis.com --project='+projectId).then(res => {
        console.log('**IAM API enabled. Checking for service account...')
        checkForServiceAccount(projectId)
    }).catch(err => {
        console.log('**There was a problem enabling the IAM API ', err)
        return "error enabling IAM API"
    })
}
// After API's check for / create service account
function checkForServiceAccount(projectId) {
    const serviceAccountCheck = new shell_cmd()
    serviceAccountCheck.execCommand('gcloud iam service-accounts list --format=json --project=' + projectId).then(res => {
        const serviceAccounts = JSON.parse(res)
        for(let i = 0; i < serviceAccounts.length; i++) {
            if (serviceAccounts[i].email == "sa-admin-caller@"+projectId+".iam.gserviceaccount.com"){
                console.log("**Service account was either found or was just created. Checking for a key you can use...")
                const oauthClientID = serviceAccounts[i].uniqueId
                checkForExistingKeyFile(projectId, oauthClientID)
                return
            }
        }
        console.log("**sa-admin-caller SA not found. Creating service account...")
        createServiceAccount(projectId)
    }).catch(err => { console.log('**Error listing service accounts',err)})
}

function createServiceAccount(projectId) {
    const serviceAccount = new shell_cmd()
    serviceAccount.execCommand('gcloud iam service-accounts create sa-admin-caller --description="For making workspace API calls" --display-name="workspace-admin-api-caller" --project='+projectId).then(res =>{
        console.log('**Service account created, getting oauth client ID...', res)
        checkForServiceAccount(projectId)
    }).catch(err => {
        console.log('**Error creating service account: ', err)
    })
}

function checkForExistingKeyFile(projectId, oauthClientID) {
    const keyFileCheck = new shell_cmd()
    keyFileCheck.execCommand('ls -al | grep sa-admin-caller').then(res => {
        const keyExists = res.search('sa-admin-caller.json')
        if(keyExists){
            console.log('**You have a key file, lets check if it exists in the project')
            compareKeyFileToExistingKeys(projectId, oauthClientID)
        }else{
            console.log("**No key file found. Creating a key file for you...")
            createKey(projectId, oauthClientID)
        }
    }).catch(err => {
        console.log('**error checking for key, NO BIG DEAL. Let\'s just make a new one... ')
        createKey(projectId, oauthClientID)
    })
}

function compareKeyFileToExistingKeys(projectId, oauthClientID) {
    const existingKeyCheck = new shell_cmd()
    const keyFile = JSON.parse(fs.readFileSync('./sa-admin-caller.json'))
    const keyId = keyFile.private_key_id
    existingKeyCheck.execCommand('gcloud iam service-accounts keys list --format=json --iam-account=sa-admin-caller@'+projectId+'.iam.gserviceaccount.com').then(res => {
        const keys = JSON.parse(res)
        let id = ""
        let keysToDelete = []
        let matched = false
        for(let i = 0; i < keys.length; i++){
            id = keys[i].name.split('/').pop()
            if(id === keyId) {
                console.log('**Key ID matches, looks like you are good to go')
                matched = true
            }
            if(keys[i].keyType != "SYSTEM_MANAGED" && id != keyId){
                keysToDelete.push(id)
            }
        }
        if(matched === false){
            createKey(projectId,oauthClientID)
            return
        }
        if(keysToDelete.length === 0 && matched === true) {
            printSuccessMessage(projectId, oauthClientID)
        }else if (keysToDelete.length != 0 && matched === true){
            deleteKeys(keysToDelete, projectId, oauthClientID)
            printSuccessMessage(projectId, oauthClientID)
        }
    })
}

function deleteKeys(keysArr, projectId, oauthClientID) {
    for(let i = 0; i<keysArr.length; i++) {
        console.log('in the loop')
        const deleteKey = new shell_cmd()
        deleteKey.execCommand('gcloud iam service-accounts keys delete '+keysArr[i]+' --iam-account=sa-admin-caller@'+projectId+'.iam.gserviceaccount.com --quiet').then(res => {
            console.log('Removed a service account key you aren\'t using')
            
        }).catch(err => {
            console.log('Error trying to delete a service account key. This is not a big deal. ')
            
        })
    }
}

function createKey(projectId, oauthClientID) {
    const createKey = new shell_cmd()
    createKey.execCommand('gcloud iam service-accounts keys create ./sa-admin-caller.json --key-file-type=json --iam-account=sa-admin-caller@'+projectId+'.iam.gserviceaccount.com').then(res => {
        console.log('**key created. Deleting other keys...', res)
        compareKeyFileToExistingKeys(projectId, oauthClientID)
    }).catch(err => {
        console.log('**error creating SA keys', err)
    })
}

function printSuccessMessage(projectId, oauthClientID) {
    console.log('\x1b[32m%s\x1b[0m','***Step 1 finished SUCCESSFULLY!!!')
    console.info('\x1b[32m%s\x1b[0m','** DOMAIN WIDE DELEGATION INFO **')
    console.info('\x1b[34m%s\x1b[0m','Go to this URL: https://admin.google.com/u/6/ac/owl/domainwidedelegation')
    console.info('\x1b[33m%s\x1b[0m','Click Add new and use the values below:')
    console.info('\x1b[32m%s\x1b[0m','client ID: ' + oauthClientID)
    console.info('\x1b[32m%s\x1b[0m','OAuth scopes: https://www.googleapis.com/auth/admin.directory.group')
    pauseForSecondStep(projectId)
}

function pauseForSecondStep(projectId) {
    const prompt = require('prompt-sync')();

    const response = prompt('Please enable Domain wide delegation, then type \'y\' to continue\n');
    if(response == 'y' || response == 'Y') {

        const options = {
            files: '../createGroups/.env',
            from: /ADMIN_PROJECT_ID=DONT_CHANGE_ME_I_AM_OVERWRITTEN_BY_THE_NODE_SCRIPT/,
            to: 'ADMIN_PROJECT_ID='+projectId
        }

        replace(options).then(result => {
            const callScript = new shell_cmd()
            callScript.execCommand('pip install -r ../createGroups/requirements.txt && python ../createGroups/create_groups.py').then(res => {
                console.log('\x1b[32m%s\x1b[0m', 'Group creation script ran successfully. Finish the prep by filling out the needed values in helper_scripts/0.5-prep.sh and running it')
                // return
                updateRegion()
            }).catch(err => {
                console.log('Group creation script had an error', err)
            })
        }).catch(err => {
            console.log('error with replace',err)
        })

    }else{
        console.log('Response did not equal "y", quitting now. You can re-run this script when you are ready.')
    }
}

function updateRegion() {
    console.log('in update TF function')
    const script = new shell_cmd()
    script.execCommand(' egrep -lRZ "US-WEST1" --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../../ | xargs sed -i -e "s/US-WEST1/'+process.env.REGION+'/g" ').then(res => {
        console.log('You are ready to run the auto deploy',res)
    }).catch(err => {
        console.log('errd on last script. ',err)
    })
}

Start()