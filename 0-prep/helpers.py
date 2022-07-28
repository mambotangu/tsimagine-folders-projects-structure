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


def print_colored(output, color: str):
    if(color == "grn"):
        print("\033[92m {}\033[00m" .format(output))
    elif(color == "prpl"):
        print("\033[95m {}\033[00m" .format(output))
    elif(color == "blu"):
        print("\033[94m {}\033[00m" .format(output))
    elif(color == "red"):
        print("\033[91m {}\033[00m" .format(output))
    elif(color == "yllw"):
        print("\033[93m {}\033[00m" .format(output))
    else:
        print("\033[1m {}\033[00m" .format(output))
