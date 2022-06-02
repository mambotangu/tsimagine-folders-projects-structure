const prompt = require('prompt-sync')();
const permissions = require('./permissions')
const replace = require('replace-in-file');

function promptForEnv() {
    const skipPrompts = prompt('Have you filled out the .env file yet? ')
    if (skipPrompts.toLowerCase() === 'y' || skipPrompts.toLowerCase() === 'yes') {
        require("dotenv").config({path: '../createGroups/.env'});
        permissions.checkAccount()
    }else{
        promptForOrg()
    }
}

function promptForOrg() {
    const organization = prompt('Please enter the organization ID: ')

    const options = {
        files: '../createGroups/.env',
        from: /ORGANIZATION=CHANGE_ME/,
        to: 'ORGANIZATION='+ organization
    }

    replace(options).then(res=> {
        promptForDomain()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the org in the .env file', err)
    })
}

function promptForDomain() {
    const domain = prompt('Please enter the domain: ')
    
    const options = {
        files: '../createGroups/.env',
        from: /DOMAIN=CHANGE_ME/,
        to: 'DOMAIN='+ domain
    }

    replace(options).then(res=> {
        promptForRegion()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the domain in the .env file', err)
    })
}

function promptForRegion() {
    const region = prompt('Please enter the primary region, E.G. "us-west1" (without quotes) ')

    const options = {
        files: '../createGroups/.env',
        from: /REGION=CHANGE_ME/,
        to: 'REGION='+ region
    }

    replace(options).then(res=> {
        promptForUseBusinessCode()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the region in the .env file', err)
    })
}

function promptForUseBusinessCode() {
    const useBusCode = prompt('Using a business code? Type y or Y for yes and N or n for no. If you are not sure then answer no. ')
    if(useBusCode === 'y' || useBusCode === 'Y' || useBusCode.toLowerCase() === 'yes') {
        const options = {
            files: '../createGroups/.env',
            from: /USE_BUS_CODE=FALSE/,
            to: 'USE_BUS_CODE=TRUE' 
        }
    
        replace(options).then(res=> {
            promptForBusinessCode()
        }).catch(err=>{
            console.log('\x1b[31m%s\x1b[0m','Error updating the use_bus_code in the .env file', err)
        })
    }else{
        promptForAppName()
    }

}

function promptForBusinessCode() {
    const busCode = prompt('Please enter business code, E.G. "zzzz" (without quotes) ')

    const options = {
        files: '../createGroups/.env',
        from: /BUS_CODE=zzzz/,
        to: 'BUS_CODE='+busCode
    }

    replace(options).then(res=> {
        promptForAppName()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the business code in the .env file', err)
    })  
}

function promptForAppName() {
    const appName = prompt('Enter the app name, E.G. "web" (without quotes) or "app1" try to keep it short for character limits sake: ')

    const options = {
        files: '../createGroups/.env',
        from: /APP_NAME=CHANGE_ME/,
        to: 'APP_NAME='+ appName
    }

    replace(options).then(res=> {
        promptForAdminEmail()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the domain in the .env file', err)
    })
}

function promptForAdminEmail() {
    const adminEmail = prompt('Enter the email of a workspace admin: ')

    const options = {
        files: '../createGroups/.env',
        from: /ADMIN_EMAIL=CHANGE_ME/,
        to: 'ADMIN_EMAIL='+adminEmail
    }

    replace(options).then(res=> {
        promptForBillingAccount()
    }).catch(err=>{
        console.log('\x1b[31m%s\x1b[0m','Error updating the admin email in the .env file', err)
    })
}

function promptForBillingAccount() {
    const billingAccount = prompt('Enter the billing account that will be linked to the deployed projects: ')

    const options = {
        files: '../createGroups/.env',
        from: /BILLING_ACCT=CHANGE_ME/,
        to: 'BILLING_ACCT='+billingAccount
    }

    replace(options).then(res=> {
        require("dotenv").config({path: '../createGroups/.env'});
        permissions.checkAccount()
    }).catch(err=> {
        console.log('\x1b[31m%s\x1b[0m', 'Error updating billing account')
    })
}

module.exports = {promptForEnv}