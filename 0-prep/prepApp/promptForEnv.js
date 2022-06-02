const prompt = require('prompt-sync')();

function promptForEnv() {
    promptForOrg()
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
        console.log('Error updating the org in the .env file', err)
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
        console.log('Error updating the domain in the .env file', err)
    })
}

function promptForRegion() {
    const region = prompt('Please enter the primary region')

    const options = {
        files: '../createGroups/.env',
        from: /REGION=CHANGE_ME/,
        to: 'REGION='+ region
    }
}

module.exports = {promptForEnv}