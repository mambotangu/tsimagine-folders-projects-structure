#! /usr/bin/env node

const fs = require('fs')
const {google} = require('googleapis');
const replace = require('replace-in-file');
const setEnv = require('./promptForEnv')

function Start() {
    console.log('Welcome to SADA\'s cloud foundations toolkit!')
    setEnv.promptForEnv()
}


// function updateRegion() {
//     console.log('in update TF function')
//     const script = new shell_cmd()
//     script.execCommand(' egrep -lRZ "US-WEST1" --exclude="*.md" --exclude="*.sh" --exclude="*.example" ../../ | xargs sed -i -e "s/US-WEST1/'+process.env.REGION+'/g" ').then(res => {
//         console.log('You are ready to run the auto deploy',res)
//     }).catch(err => {
//         console.log('errd on last script. ',err)
//     })
// }

Start()
