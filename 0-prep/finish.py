import subprocess
import os
import typer
import shlex
from helpers import *


def success_message(project_id, clientId):
    # print_colored("Step 1 finished successfully", "grn")
    # print_colored("DOMAIN WIDE DELEGATION INFO", "prpl")
    print("DOMAIN WIDE DELEGATION INFO:")
    print("Go to the URL below")

    # print_colored(
    #     "Go to this url https://admin.google.com/u/6/ac/owl/domainwidedelegation", "prpl")
    print("https://admin.google.com/u/6/ac/owl/domainwidedelegation")
    print("Click Add New and use the values below:")
    # print_colored("Client ID: " + clientId, "yllw")
    print("Client ID: " + clientId)

    # print_colored("OAuth scopes: https://www.googleapis.com/auth/admin.directory.group", "yllw")
    print("OAuth scopes: https://www.googleapis.com/auth/admin.directory.group")
    pause_for_second_step(project_id)


def pause_for_second_step(project_id):
    dwd_confirm = typer.confirm(
        "Once you've completed the domain wide delegation steps type Y to continue")
    if(dwd_confirm):
        try:
            cwd = os.getcwd()
            env_file = open(cwd + "/createGroups/.env", "r")
            lines = env_file.readlines()
            for line in lines:
                print(line)
                if("ADMIN_PROJECT_ID" in line):
                    create_groups()
                    return
            print("addming admin project id to env file")
            env_file = open(cwd + "/createGroups/.env", "a")
            env_file.write("\nADMIN_PROJECT_ID="+project_id)
            create_groups()
        except Exception as e:
            print("error creating groups", e)


def create_groups():
    create_groups_cmd = "pip install -r ./createGroups/requirements.txt && python ./createGroups/create_groups.py"
    try:
        subprocess.run(shlex.split(create_groups_cmd), shell=True)
        print("Groups created! Run 0.5-prep to finish prepping your environment")
    except Exception as e:
        print("error on create_groups", e)
