from ast import Sub
import typer
import subprocess
import sys
import setupEnv
import permissions
import project
import shlex
import json
from helpers import *
from rich.prompt import Prompt
import os


def invoke_subprocess(command_str: str, capture_output: bool = False, text: bool = False):
    return subprocess.run(command_str.split(" "), capture_output=capture_output, text=text)


def check_account(org_id):
    print_colored("Checking which account you're using...", "prpl")
    auth_list_command = "gcloud auth list --format=json"
    auth_output = subprocess.check_output(
        shlex.split(auth_list_command), shell=True)
    auth_output_json = json.loads(auth_output)

    for idents in auth_output_json:
        if(idents["status"] == "ACTIVE"):
            print_colored("You're currently logged in as:" +
                          idents["account"], "prpl")

            account_confirm = typer.confirm("is " + bcolors.BOLD + idents["account"] + bcolors.ENDC +
                                            " the account you want to use to deploy? If no, the script will exit and you must switch to the account you wish to use. ")
            if(account_confirm):
                check_permissions(org_id, idents["account"])
                return
            else:
                return False

                # account_to_use = Prompt.ask("Which account will you use to deploy?")
    print_colored(
        "The following accounts were detected but none are currently active.\n", "yllw")
    print(auth_output_json)
    print_colored(
        "\n Please run 'gcloud auth login' and log in with the account you wish to use", "yllw")


def check_permissions(org_id, identity):
    print_colored("Checking permissions...", "prpl")
    perms_list_command = "gcloud organizations get-iam-policy " + org_id + " --format=json"
    perms_output = subprocess.check_output(
        shlex.split(perms_list_command), shell=True)
    perms_output_json = json.loads(perms_output)
    perms_needed = ['roles/resourcemanager.organizationAdmin',
                    'roles/resourcemanager.folderAdmin',
                    'roles/resourcemanager.projectCreator',
                    'roles/compute.xpnAdmin',
                    'roles/logging.admin',
                    'roles/storage.admin']

    perms_found = []

    for perm in perms_output_json["bindings"]:
        if(perm["role"] in perms_needed):
            if("user:" + identity in perm["members"]):
                perms_found.append(perm["role"])
    if(len(perms_found) == len(perms_needed)):
        print_colored(
            "You have the needed org roles. Please manually ensure you have rights on the billing account you provided in the .env file", "grn")
        project.check_for_project(org_id)

    else:
        print_colored(
            "You are missing 1 or more permissions needed to deploy the foundation. Please comapre the lists to see which roles are missing", "yllw")
        perms_found.sort()
        print("Permissions found:  ", perms_found)
        perms_needed.sort()
        print("Permissions needed: ", perms_needed)
