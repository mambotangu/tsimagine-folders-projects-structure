from ast import Sub
import typer
import subprocess
import sys
import setupEnv
import permissions
import shlex
import json
from rich.prompt import Prompt
import os


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def invoke_subprocess(command_str: str, capture_output: bool = False, text: bool = False):
    return subprocess.run(command_str.split(" "), capture_output=capture_output, text=text)


def check_account():
    print(bcolors.OKGREEN + "Checking which account you're using..." + bcolors.ENDC)
    auth_list_command = "gcloud auth list --format=json"
    auth_output = subprocess.check_output(
        shlex.split(auth_list_command), shell=True)
    auth_output_json = json.loads(auth_output)

    for idents in auth_output_json:
        if(idents["status"] == "ACTIVE"):
            print("You're currently logged in as: ",
                  bcolors.BOLD + idents["account"] + bcolors.ENDC)
            account_confirm = typer.confirm("is " + bcolors.BOLD + idents["account"] + bcolors.ENDC +
                                            " the account you want to use to deploy? If no, the script will exit and you must switch to the account you wish to use. ")
            if(account_confirm):
                check_permissions()
            else:
                return False

                # account_to_use = Prompt.ask("Which account will you use to deploy?")

    print("The following accounts were detected but none are currently active.\n" +
          auth_output_json + "\n Please run 'gcloud auth login' and login with the account you wish to use")


def check_permissions():
    print("Checking permissions")
