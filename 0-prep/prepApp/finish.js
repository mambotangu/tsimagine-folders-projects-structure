const replace = require('replace-in-file');
const {shell_cmd} = require('./shell_cmd')

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
            from: /ADMIN_PROJECT_ID=CHANGE_ME/,
            to: 'ADMIN_PROJECT_ID='+projectId
        }

        replace(options).then(result => {
            const callScript = new shell_cmd()
            callScript.execCommand('pip install -r ../createGroups/requirements.txt && python ../createGroups/create_groups.py').then(res => {
                console.log('\x1b[32m%s\x1b[0m', 'Group creation script ran successfully. Finish the prep by filling out the needed values in helper_scripts/0.5-prep.sh and running it')
                return
                // updateRegion() 
            }).catch(err => {
                console.log('Group creation script had an error', err)
            })
        }).catch(err => {
            console.log('error with replace',err)
        })

    }else{
        console.log('Response did not equal "y", quitting now. You can re-run this script when you are ready. It is idempotent')
    }
}

module.exports = {printSuccessMessage}