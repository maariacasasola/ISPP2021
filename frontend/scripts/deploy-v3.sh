#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "sprint3" ]]; then
  ng build --configuration=v3
fi