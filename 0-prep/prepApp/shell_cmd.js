const exec = require('child_process').exec;

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

module.exports = {shell_cmd}