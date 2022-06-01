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
                console.log('You are currently logged in as ' + ident[i].account)
                const response = prompt('Is ' + ident[i].account + ' the account you want to deploy with? (type y for yes) ')
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
        console.log(perms.bindings)
        for (let i = 0; i<perms.length; i++) {
            console.log(perms[i])
        }
    }).catch(err=> {
        console.log('There was an error checking your permissions for the organization', err)
    })
}

module.exports = { checkAccount, checkPermissions}