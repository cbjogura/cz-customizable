#!/usr/bin/env bash

set -e

# All publication tasks run from within the publishing module dir so pushd to the build dir
TAG=
if [[ "$1" == "--beta" ]]; then
  TAG="--tag beta"
fi

echo TAG = $TAG
packageName=$(node -p "require('./package.json').name")
echo Package name is ${packageName}

# Force republication by removing first
echo Unpublishing ${packageName}
npm unpublish --@ce:registry=http://localhost:4873 ${packageName} --force || true

echo Publishing ${packageName}
npm publish --@ce:registry=http://localhost:4873 $TAG

