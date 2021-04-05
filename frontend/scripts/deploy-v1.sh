#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "sprint1" ]]; then
  ng build --configuration=v1
fi