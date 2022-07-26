from helpers import *
import subprocess
import shlex
import json
import difflib

from random import randint


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
    # create_workspace_project(org_id)


def create_workspace_project(org_id):
    print("Creating workspace project...")
    suffix = randint(100, 999)
    create_prj_cmd = "gcloud projects create foundation-workspace-" + \
        str(suffix) + " --name=foundation-workspace --organization=" + \
        org_id + " --labels=type=foundation"
    create_prj_output = subprocess.check_output(
        shlex.split(create_prj_cmd), shell=True)
    print(create_prj_output)
    # create_prj_json = json.loads(create_prj_output)
    # print_colored(create_prj_json, "red")


def enable_admin(project_id):
    print_colored("Enabling workspace admin API...", "prpl")
    enable_api_cmd = "gcloud services enable admin.googleapis.com --project=" + project_id
    try:
        enable_api_output = subprocess.check_output(
            shlex.split(enable_api_cmd), shell=True)
        print_colored("Successfully enabled admin API.", "grn")
        enable_iam(project_id)
    except:
        print_colored("There was an error:", "red")
        print(enable_api_output)


def enable_iam(project_id):
    print_colored("Enabling IAM API...", "prpl")
    enable_iam_cmd = "gcloud services enable iam.googleapis.com --project=" + project_id
    try:
        enable_iam_output = subprocess.check_output(
            shlex.split(enable_iam_cmd), shell=True)
        print_colored("Successfully enabled IAM API.", "grn")
    except Exception as e:
        print_colored("There was an error enabling IAM:" + e, "red")
        print(enable_iam_output)
