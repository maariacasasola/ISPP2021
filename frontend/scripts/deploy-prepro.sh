#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "develop" ]]; then
  ng build --configuration=preproduction
fi