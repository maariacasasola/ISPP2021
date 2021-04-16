#!/bin/sh

if [[ "$TRAVIS_BRANCH" = "sprint2" ]]; then
  ng build --configuration=sprint2
fi