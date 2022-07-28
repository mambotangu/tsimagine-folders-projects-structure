from ast import Sub
from asyncio.windows_events import NULL
from asyncore import write
import typer
import permissions
from helpers import *
from rich.prompt import Prompt
import os
app = typer.Typer()


@app.command()
def help():
    print_colored(
        "Welcome to the SADA cloud foundations toolkit. To get started run 'python main.py start'", "prpl")


@app.command()
def start():
    print_colored("Let's get started!", "grn")
    create_env_file()


def create_env_file():
    """
    This function will create the env file if you haven't already. 
    """
    create_env_file = typer.confirm(bcolors.OKCYAN +
                                    "Would you like to create a .env file for the group creation script? (answer yes here if you haven't created a .env file already)" + bcolors.ENDC)
    if(create_env_file):
        print_colored("Creating .env file", "grn")
        cwd = os.getcwd()
        try:
            f = open(cwd + "/createGroups/.env", "x")
            print_colored(".env created", "grn")
            writeValuesToEnv()
        except:
            print_colored(
                "Looks like a .env file already exists. No problem, let's write what we need to it.", "yllw")
            writeValuesToEnv()
    else:
        writeValuesToEnv()


def writeValuesToEnv():
    """
    This function will write the values you enter to the env file for the create groups script.
    """
    write_env_file = typer.confirm(
        bcolors.OKCYAN + "Do you need to populate the .env file with valid values?" + bcolors.ENDC)
    if(not write_env_file):
        f = open("./createGroups/.env", "r")
        for x in f:
            if(x.find('ORGANZIATION=')):
                org_id = x.split('=')
                org_id = org_id[1].strip()
                break
        if(org_id == NULL):
            print_colored("An org ID was not found in the .env file...", "red")
            exit(1)
        permissions.check_account(org_id)
    else:
        org_id = Prompt.ask(
            bcolors.HEADER + "Please enter the organization ID" + bcolors.ENDC)
        admin_email = Prompt.ask(
            bcolors.HEADER + "Enter a workspace admin email" + bcolors.ENDC)
        domain = admin_email.split("@")
        region = Prompt.ask(
            bcolors.HEADER + "Primary region, E.G. 'us-west1'" + bcolors.ENDC)
        app_name = Prompt.ask(bcolors.HEADER +
                              "Enter the app name, E.G. 'web' (without quotes) or 'app1' try to keep it short for character limits sake" + bcolors.ENDC)

        print(bcolors.HEADER + "you entered: \n" + bcolors.ENDC)
        print(org_id + "\n" + admin_email + "\n" + region + "\n" + app_name)

        confirm = typer.confirm(
            bcolors.OKCYAN + "is the information above correct?" + bcolors.ENDC)
        if(confirm):
            cwd = os.getcwd()
            env_file = open(cwd + "/createGroups/.env", "w")
            env_file.write("ORGANIZATION=" + org_id + "\n")
            env_file.write("ADMIN_EMAIL=" + admin_email + "\n")
            env_file.write("DOMAIN=" + domain[1] + "\n")
            env_file.write("REGION=" + region + "\n")
            env_file.write("USE_BUS_CODE=false" + "\n")
            env_file.write("APP_NAME=" + app_name + "\n")
            permissions.check_account(org_id)
        else:
            writeValuesToEnv()


if __name__ == "__main__":
    app()
