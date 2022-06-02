# The boring stuff

If you really wanna read the 10,000 ft overview you can find it [here](docs/overview.md)

**WE CURRENTLY DONT SUPPORT WINDOWS OS's BUT I AM WORKING VERY HARD TO CHANGE THAT**

# Getting Started

The TL;DR Pre-Requisites, customization and execution instructions can be found [here](docs/getting_started.md).

### [Prereqs](prep.js & 0.5-prep.sh)

moved to [here](0-prep/README.md)

### [1. bootstrap](./1-bootstrap/)

moved to [here](1-bootstrap/README.md)

### [2. Organization](./2-organization/)

moved to [here](2-organization/README.md)

### [3. Shared](./3-shared/)

moved to [here](3-shared/README.md)

### [4. dev](./4-dev/)

moved to [here](4-dev/README.md)

### [5. dev](./5-qa/)

moved to [here](5-qa/README.md)

### [6. dev](./6-uat/)

moved to [here](6-uat/README.md)

### [7. dev](./7-prod/)

moved to [here](7-prod/README.md)

### Final View

Once all steps above have been executed your GCP organization should represent the structure shown below, with projects being the lowest nodes in the tree.

```
example-organization/
└── fldr-bootstrap
    └── prj-zzzz-b-tfseed
└── fldr-dev
    └── prj-zzzz-d-app1
└── fldr-prod
    └── prj-zzzz-p-app1
└── fldr-qa
    └── prj-zzzz-q-app1
└── fldr-uat
    └── prj-zzzz-u-app1
└── fldr-shared
    ├── prj-zzzz-s-log-mon
    ├── prj-zzzz-s-svpc
    └── prj-zzzz-s-secrets-kms
```

### Branching strategy and PR process

- main
  I intend to try and keep main in a stable, working state.
- dev-barclay
  if you're into having the latest and greatest (even if it's broken) try this branch out.

The foundations repo was meant to be built upon, cut a branch, make an improvement and create a pull request or fork for a different type of foudation entirely using this repo as a starting point.

Pull requests are reviewed before merging. Everyone is welcome to open a PR and contribute.
