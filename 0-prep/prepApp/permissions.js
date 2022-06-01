var Account
require("dotenv").config({path: '../createGroups/.env'});
const {shell_cmd} = require('./shell_cmd')
const prompt = require('prompt-sync')();

// Get the user identity 
function checkAccount() {
    const checkPerms = new shell_cmd()
    console.log('Checking your permissions in the org specified in the .env file')
    checkPerms.execCommand(`gcloud auth list --format=json`).then(res=> {
        const ident = JSON.parse(res)
        for(let i = 0; i<ident.length; i++) {
            if(ident[i].status === "ACTIVE"){
                console.log('You are currently logged in as ' + '\x1b[32m' + ident[i].account + '\x1b[0m')
                const response = prompt('Is ' + '\x1b[32m' + ident[i].account + '\x1b[0m' +' the account you want to deploy with? Type y for yes, otherwise, type any other key to cancel and log in using a different account. ')
                if(response == 'y' || response == 'Y') {
                    Account = ident[i].account
                    checkPermissions(Account)
                }
            }
        }

    }).catch(err=> {
        console.log('There was an error checking which account you\'re using: ',err)
    })
}

// check user IAM permissions in the org
function checkPermissions(account) {
    const checkPerms = new shell_cmd()
    console.log('Checking your permissions in the org specified in the .env file')
    checkPerms.execCommand(`gcloud organizations get-iam-policy ${process.env.ORGANIZATION} --format=json`).then(res=> {
        const perms = JSON.parse(res)
        const permissionsNeeded = [
            'roles/resourcemanager.organizationAdmin',
            'roles/resourcemanager.folderAdmin',
            'roles/resourcemanager.projectCreator',
            'roles/compute.xpnAdmin',
            'roles/logging.admin',
            'roles/storage.admin'
        ]
        var permissionsFound = []
        for (let i = 0; i<perms.bindings.length; i++) {
            
            if(permissionsNeeded.includes(perms.bindings[i].role)) {
                console.log(perms.bindings[i].members)
                if(perms.bindings[i].members.includes('user:' + account)){
                    console.log(account, ' has ', perms.bindings[i].role)
                    permissionsFound.push(perms.bindings[i].role)
                }
            }

        }
        if(permissionsFound.length == permissionsNeeded.length) {
            console.log('You have all the necessary org roles. Please manually ensure you have a billing account to use')
        }

    }).catch(err=> {
        console.log('There was an error checking your permissions for the organization', err)
    })
}

module.exports = { checkAccount, checkPermissions}