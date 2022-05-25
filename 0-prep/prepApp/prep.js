require("dotenv").config();
const fs = require('fs')
const exec = require('child_process').exec;

// We will wrap all of our gcloud commands in this async function to ensure they always return before we continue
function gcloud_cmd() {
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
const start = new gcloud_cmd();

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
// If the project doesn't exist, create it.
function createWorkspaceProject() {
    const project = new gcloud_cmd()
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
    const enableAdmin = new gcloud_cmd()
    enableAdmin.execCommand('gcloud services enable admin.googleapis.com --project='+projectId).then(res => {
        console.log('**Admin API enabled. Enabling IAM API')
        enableIAM(projectId)
    }).catch(err => {
        console.log('**There was a problem enabling the admin API ', err)
        return 'error enabling the admin API '
    })
}

function enableIAM(projectId) {
    const enableIAM = new gcloud_cmd()
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
    const serviceAccountCheck = new gcloud_cmd()
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
    const serviceAccount = new gcloud_cmd()
    serviceAccount.execCommand('gcloud iam service-accounts create sa-admin-caller --description="For making workspace API calls" --display-name="workspace-admin-api-caller" --project='+projectId).then(res =>{
        console.log('**Service account created, getting oauth client ID...', res)
        checkForServiceAccount(projectId)
    }).catch(err => {
        console.log('**Error creating service account: ', err)
    })
}

function checkForExistingKeyFile(projectId, oauthClientID) {
    const keyFileCheck = new gcloud_cmd()
    keyFileCheck.execCommand('ls ../ -al | grep sa-admin-caller').then(res => {
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
    const existingKeyCheck = new gcloud_cmd()
    const keyFile = JSON.parse(fs.readFileSync('../sa-admin-caller.json'))
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
            sayGoodbye(oauthClientID)
        }else if (keysToDelete.length != 0 && matched === true){
            deleteKeys(keysToDelete, projectId, oauthClientID)
        }
    })
}

function deleteKeys(keysArr, projectId, oauthClientID) {
    for(let i = 0; i<keysArr.length; i++) {
        console.log('in the loop')
        const deleteKey = new gcloud_cmd()
        deleteKey.execCommand('gcloud iam service-accounts keys delete '+keysArr[i]+' --iam-account=sa-admin-caller@'+projectId+'.iam.gserviceaccount.com --quiet').then(res => {
            console.log('Removed a service account key you aren\'t using')
            return
        }).catch(err => {
            console.log('Error trying to delete a service account key. This is not a big deal. ')
            return
        })
    }
}

function createKey(projectId, oauthClientID) {
    const createKey = new gcloud_cmd()
    createKey.execCommand('gcloud iam service-accounts keys create ../sa-admin-caller.json --key-file-type=json --iam-account=sa-admin-caller@'+projectId+'.iam.gserviceaccount.com').then(res => {
        console.log('**key created. Deleting other keys...', res)
        compareKeyFileToExistingKeys(projectId, oauthClientID)
    }).catch(err => {
        console.log('**error creating SA keys', err)
    })
}

function sayGoodbye(oauthClientID) {
    console.log('\x1b[32m%s\x1b[0m','***FINISHED SUCCESSFULLY!!!')
    console.info('\x1b[32m%s\x1b[0m','** DOMAIN WIDE DELEGATION INFO **')
    console.info('\x1b[34m%s\x1b[0m','Go to this URL: https://admin.google.com/u/6/ac/owl/domainwidedelegation')
    console.info('\x1b[33m%s\x1b[0m','Click Add new and use the values below:')
    console.info('\x1b[32m%s\x1b[0m','client ID: ' + oauthClientID)
    console.info('\x1b[32m%s\x1b[0m','OAuth scopes: https://www.googleapis.com/auth/admin.directory.group')
    return
}