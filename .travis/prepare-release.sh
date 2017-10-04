#!/bin/sh

git remote set-url origin https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

if [ -z "${TRAVIS_TAG}" ]; then
  npm version patch -m "Releasing version %s [ci skip]" && git push origin HEAD:master && git push origin HEAD:master --tags;
fi
