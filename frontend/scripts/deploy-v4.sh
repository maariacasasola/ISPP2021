#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "sprint4" ]]; then
  ng build --configuration=v4
fi