import json
import requests
import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client.service_account import ServiceAccountCredentials
load_dotenv()
# Email of the Service Account
# SERVICE_ACCOUNT_EMAIL = '<ADMIN_SA>@<PROJECT_ID>.iam.gserviceaccount.com'
SERVICE_ACCOUNT_EMAIL = 'sa-admin-caller'+'@' + \
    os.environ['ADMIN_PROJECT_ID'] + '.iam.gserviceaccount.com'

# Path to the Service Account's Private Key file
SERVICE_ACCOUNT_PKCS12_FILE_PATH = './'+'sa-admin-caller'+'.json'


def create_directory_service(user_email):
    """
    Build and returns an Admin SDK Directory service object authorized with the service accounts
    that act on behalf of the given user.
    Args:
      user_email: The email of the user. Needs permissions to access the Admin APIs.
    """
    try:
        print("Getting token...")
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            SERVICE_ACCOUNT_PKCS12_FILE_PATH,
            scopes=['https://www.googleapis.com/auth/admin.directory.group'])
    except NotImplementedError:
        print("** Looks like you're missing pyOpenSSL. Attempting to install it....")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip3', 'install',
                                   'pyOpenSSL'])
            print("** pyOpenSSL installed. Restarting script")
            os.system('python3 create_groups.py')
            exit()
        except Exception as error:
            print("THERE WAS AN ERROR TRYING TO INSTALL pyOpenSSL: \n\n ", error,
                  "Please try installing pyOpenSSL manually by running: \n\n pip3 install pyOpenSSL \n\n or \n\n pip install pyOpenSSL if you're still using python 2\n\n")
            exit(1)

    except Exception as e:
        print("Something went wrong, here's the error: \n", e, "\n\n")

    credentials = credentials.create_delegated(user_email)
    service = build('admin', 'directory_v1', credentials=credentials)

    groups = [
        'gcp-billing-admins',
        'gcp-network-admins',
        'gcp-organization-admins',
        'gcp-auditors',
        'gcp-security-admins',
        'gcp-support-admins',
        'gcp-' + os.environ['APP_NAME'] + '-admins',
        'gcp-' + os.environ['APP_NAME'] + '-developers',
        'gcp-' + os.environ['APP_NAME'] + '-devops'
    ]

    for i in range(len(groups)):

        group = {  # JSON template for Group resource in Directory API.
            "nonEditableAliases": [  # List of non editable aliases (Read-only)
            ],
            "kind": "admin#directory#group",  # Kind of resource this is.
            "description": "A String",  # Description of the group
            "name": groups[i],  # Group name
            # Is the group created by admin (Read-only) *
            "adminCreated": True,
            "email": groups[i]+"@"+os.environ['DOMAIN'],  # Email of Group
            "aliases": [  # List of aliases (Read-only)
            ],
        }
        try:
            group_add = service.groups().insert(body=group).execute()
            print("Group created \n", group_add, "\n\n")
        except HttpError as e:
            if (e.resp.get('content-type', '').startswith('application/json')):
                reason = json.loads(e.content).get(
                    'error').get('errors')[0].get('reason')

                if (reason == 'duplicate'):
                    print('*** group already exists, trying the next one')
                else:
                    print(
                        "*** There was an error creating the group:\n ", e)
                    exit(1)
        except Exception as e:
            print("*** Error creating groups: \n", e)
            exit(1)


create_directory_service(os.environ['ADMIN_EMAIL'])
