## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running on Kind

### Requirements
* Kind 
* Docker
* kublectl
* Helm

### Start kind 
```bash
$ ./env/kind/strat-kind.sh
```

### Deploy mysql

### Deploy api
```bash
$ kubectl apply -f env/kind/deployment.yaml
```

```
 NOTE: please take a look for the frontend repository to deploy it too.
```