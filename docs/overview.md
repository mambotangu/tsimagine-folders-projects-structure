# The official SADA proserv foundations product

This is repo shows how SADA can use scripts & Terraform modules to build a GCP foundation, based on the [Google Cloud security foundations guide](https://services.google.com/fh/files/misc/google-cloud-security-foundations-guide.pdf) and combined with SADA best practice.

The supplied structure and code is intended to form a starting point for building your own foundation with pragmatic defaults you can customize to meet your own requirements.

## Overview

This repo contains several distinct Terraform scripts each within their own directory that must be applied separately, but in sequence. The prereqs must be completed before any Terraform is run in the environment. Each of these Terraform scripts are to be layered on top of each other, running in the following order.
