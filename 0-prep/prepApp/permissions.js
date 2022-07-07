var Account
// require("dotenv").config({path: '../createGroups/.env'});
const {shell_cmd} = require('./shell_cmd')
const prompt = require('prompt-sync')();
const project = require('./project')
// Get the user identity 
function checkAccount() {
    const checkPerms = new shell_cmd()
    console.log('Checking which account you are using')
    checkPerms.execCommand(`gcloud auth list --format=json`).then(res=> {
        const ident = JSON.parse(res)
        for(let i = 0; i<ident.length; i++) {
            if(ident[i].status === "ACTIVE"){
                console.log('You are currently logged in as ' + '\x1b[32m' + ident[i].account + '\x1b[0m')
                const response = prompt('Is ' + '\x1b[32m' + ident[i].account + '\x1b[0m' +' the account you want to deploy with? Type y for yes, otherwise, type any other key to cancel and log in using a different account then run the script again. ')
                if(response == 'y' || response == 'Y') {
                    Account = ident[i].account
                    checkPermissions(Account)
                }else{
                    return false
                }
            }
        }

    }).catch(err=> {
        console.log('\x1b[31m%s\x1b[0m','There was an error checking which account you\'re using: ',err)
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
                if(perms.bindings[i].members.includes('user:' + account)){
                    permissionsFound.push(perms.bindings[i].role)
                }
            }
        }
        if(permissionsFound.length == permissionsNeeded.length) {
            console.log('You have all the necessary org roles. Please manually ensure you have a billing account to use')
            project.checkForProject()
        }else{
            console.log('You are missing 1 or more permissions needed to deploy the foundation. Please compare these lists to see which permissions you need to add to your account')
            console.log('Permissions found: ', permissionsFound.sort())
            console.log('Permissions needed: ', permissionsNeeded.sort())
        }

    }).catch(err=> {
        console.log('\x1b[31m%s\x1b[0m','There was an error checking your permissions for the organization', err)
    })
}

module.exports = { checkAccount, checkPermissions}