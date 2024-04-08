#!/usr/bin/env bash

set -e

# All publication tasks run from within the publishing module dir so pushd to the build dir
pushd build

STAGE=$1
PKG_VERSION=$2

if [[ -z "$STAGE" || -z "$PKG_VERSION" ]]; then
    echo "No stage or version specified"
    exit 1
fi

echo "Publishing with stage: $STAGE"

# Use beta tag for all stages except prodSidecar
if [ $STAGE != 'prodSidecar' ]; then
    # set the package.json version to be the current version + `-beta`
    npm version $PKG_VERSION-beta
    TAG='--tag beta'
fi

# Don't actually publish anything except in the real prod stages. (Useful for developer testing..)
if [[ $STAGE != 'preprodSidecar' && $STAGE != 'prodSidecar' ]]; then
    DRYRUN='--dry-run'
fi

PUBLISH_ARGS="$TAG $DRYRUN"

echo "Publishing to legacy Artifactory with args: $PUBLISH_ARGS"
npx artifactory-manager activateLegacyArtifactory
npm publish $PUBLISH_ARGS

echo "Publishing to SAAS Artifactory with args: $PUBLISH_ARGS"
npx artifactory-manager activateSaasArtifactory
npm publish $PUBLISH_ARGS
