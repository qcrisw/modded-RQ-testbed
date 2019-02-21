# modded-RQ-testbed

This repo represents a testbed for testing out the modded RQ library forked from github.
Because this repo has two submodules it is advisable to run this command in order to clone the repo to avoid potential issues in the future:
```
git clone --recurse-submodules this-repo
```
Unless you want to clone this repo only, then just run the normal clone command.

## Issues with recurse submodules
If you face an issue like this:
```
fatal: clone of 'git@github.com:qcrisw/rq.git' into submodule path '/modded-RQ-testbed/rq' failed
Failed to clone 'rq'. Retry scheduled
Cloning into '/modded-RQ-testbed/rq-standalone-example'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

```

Simply edit the .gitmodules file and change `git@github.com:qcrisw/rq.git` to its https equivalent. 

## Building and running
```
cd this/repo
docker-compose build
docker-compose up
```

## Running Tests
```
docker-compose up tests tests_pypy
```
Given that the RQ repo runs tests for python 2.6, 2.7, 3.3, 3.4, 3.5, 3.6, 3.7, pypy and flake8. Docker currently does not have images for 2.6 and 3.3. So in order to prevent unnecessary failures we modify the `tox.ini`  file accordingly. 

For building the `tests` image:
Replace the definition of envlist in `tox.ini` with the follwing:
```
envlist=py27,py34,py35,py36,py37,flake8
```
Then run the following:
```
docker-compose build tests
```

For building the `tests_pypy` image:
Replace the definition of envlist in `tox.ini` with the follwing:
```
envlist=pypy
```
Then run the following:
```
docker-compose build tests_pypy
```
This will test everything except python 2.6 and 3.3. 
