#!/bin/sh

git remote set-url origin https://${GITHUB_TOKEN}@github.com/burgaard/string-algorithms.git
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

npm version patch -m "Releasing version %s" && git push origin HEAD:master && git push origin HEAD:MASTER --tags;
