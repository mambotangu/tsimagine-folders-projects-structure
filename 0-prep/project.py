import subprocess
from helpers import *
import shlex
from finish import *
import json

from random import randint


def invoke_subprocess(command_str: str, capture_output: bool = False, text: bool = False):
    return subprocess.run(command_str.split(" "), capture_output=capture_output, text=text)


def check_for_project(org_id):
    print_colored(
        "Checking for an existing workspace-foundation project...", "prpl")
    list_projects_cmd = "gcloud projects list --format=json --filter=foundation-workspace"
    list_projects_output = subprocess.check_output(
        shlex.split(list_projects_cmd), shell=True)
    list_projects_json = json.loads(list_projects_output)
    for project in list_projects_json:
        if(project["parent"]["id"] == org_id and project["lifecycleState"] == "ACTIVE"):
            print_colored("foundation-workspace project found", "grn")
            enable_admin(project["projectId"])
            return
    print_colored("No workspace project found", "prpl")
    create_workspace_project(org_id)


def create_workspace_project(org_id):
    print_colored("Creating workspace project...", "prpl")
    suffix = randint(100, 999)
    create_prj_cmd = "gcloud projects create foundation-workspace-" + \
        str(suffix) + " --name=foundation-workspace --organization=" + \
        org_id + " --labels=type=foundation"
    try:
        create_prj_output = subprocess.check_output(
            shlex.split(create_prj_cmd), shell=True)
        enable_admin("foundation-workspace-" + str(suffix))
    except Exception as e:
        print_colored("Error creating project...", "red")
        print(e)


def enable_admin(project_id):
    print_colored("Enabling workspace admin API...", "prpl")
    enable_api_cmd = "gcloud services enable admin.googleapis.com --project=" + project_id
    try:
        enable_api_output = subprocess.check_output(
            shlex.split(enable_api_cmd), shell=True)
        print_colored("Successfully enabled admin API.", "grn")
        enable_iam(project_id)
    except Exception as e:
        print_colored("There was an error:", "red")
        print(e)


def enable_iam(project_id):
    print_colored("Enabling IAM API...", "prpl")
    enable_iam_cmd = "gcloud services enable iam.googleapis.com --project=" + project_id
    try:
        enable_iam_output = subprocess.check_output(
            shlex.split(enable_iam_cmd), shell=True)
        print_colored("Successfully enabled IAM API.", "grn")
        check_for_service_account(project_id)
    except Exception as e:
        print_colored("There was an error enabling IAM:", "red")
        print(e)


def check_for_service_account(project_id):
    print_colored(
        "Checking for service account in foundation workspace project...", "prpl")
    sa_list_cmd = "gcloud iam service-accounts list --format=json --project=" + project_id
    try:
        sa_list_output = subprocess.check_output(
            shlex.split(sa_list_cmd), shell=True)
        sa_list_json = json.loads(sa_list_output)
        for sa in sa_list_json:
            if(sa["email"] == "sa-admin-caller@" + project_id + ".iam.gserviceaccount.com"):
                print_colored("Service account found", "grn")
            check_for_key_file(project_id, sa["oauth2ClientId"])
            return
        print_colored(
            "Admin caller SA not found", "prpl")
        create_service_account(project_id)
    except Exception as e:
        print_colored("Error checking for service account", "red")
        print(e)


def create_service_account(project_id):
    print_colored("Creating service account...", "prpl")
    create_sa_cmd = "gcloud iam service-accounts create sa-admin-caller --description='For making workspace API calls' --display-name='workspace-admin-api-caller' --project=" + project_id
    try:
        sa_cmd_output = subprocess.check_output(
            shlex.split(create_sa_cmd), shell=True)
        print_colored("SA created", "grn")
        check_for_service_account(project_id)
    except Exception as e:
        print_colored("Error creating service account...", "red")
        print(e)


def check_for_key_file(project_id, clientId):
    print_colored("Checking for SA key...", "prpl")
    try:
        files_cmd_output = subprocess.check_output(
            "ls", shell=True)
        if(str(files_cmd_output).find("sa-admin-caller") != -1):
            print_colored("key found", "grn")
            # print("Key found")
            compare_key_to_existing(project_id, clientId)
        else:
            print("No key found.")
            create_sa_key(project_id, clientId)
    except Exception as e:
        print_colored("Error checking for key file", "red")
        print(e)


def create_sa_key(project_id, clientId):
    print_colored("creating key", "prpl")
    create_key_cmd = "gcloud iam service-accounts keys create ./sa-admin-caller.json --key-file-type=json --iam-account=sa-admin-caller@" + \
        project_id + ".iam.gserviceaccount.com"
    try:
        create_key_output = subprocess.check_output(
            shlex.split(create_key_cmd), shell=True)
        print_colored("key created", "grn")
        print(create_key_output)
        compare_key_to_existing(project_id, clientId)
    except Exception as e:
        print_colored("error creating key", "red")
        print(e)


def compare_key_to_existing(project_id, clientId):
    keys_to_delete = []
    key_file = open("./sa-admin-caller.json")
    key_json = json.load(key_file)
    key_id = key_json["private_key_id"]
    key_check_cmd = "gcloud iam service-accounts keys list --format=json --iam-account=sa-admin-caller@" + \
        project_id + ".iam.gserviceaccount.com"
    matched = False
    try:
        key_check_output = subprocess.check_output(
            shlex.split(key_check_cmd), shell=True)
        keys_json = json.loads(key_check_output)
        for key in keys_json:
            id = str(key["name"]).split("/").pop()
            if(id == key_id):
                # print_colored("Key id matched. Good to go.", "grn")
                print("Key id matched. Good to go.")

                matched = True
            if(key["keyType"] != "SYSTEM_MANAGED" and id != key_id):
                keys_to_delete.append(id)
        if(matched == False):
            create_sa_key(project_id, clientId)
        elif(keys_to_delete == 0 and matched == True):
            success_message(project_id, clientId)
        elif(keys_to_delete != 0 and matched == True):
            delete_keys(keys_to_delete, project_id)
            success_message(project_id, clientId)
    except Exception as e:
        print_colored("error checking existing keys", "red")
        print(e)


def delete_keys(keys, project_id):
    try:
        for key in keys:
            del_cmd = "gcloud iam service-accounts keys delete" + key + \
                " --iam-account=sa-admin-caller@" + project_id + \
                ".iam.gserviceaccount.com --quiet"
            subprocess.run(shlex.split(del_cmd), shell=True)
    except Exception as e:
        print("error deleting keys", e)
