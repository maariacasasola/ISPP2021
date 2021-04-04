#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "master" ]]; then
  ng build --prod
fi