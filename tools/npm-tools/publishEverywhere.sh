#!/usr/bin/env bash

set -e

# All publication tasks run from within the publishing module dir so pushd to the build dir

TAG=
if [[ "$1" == "--beta" ]]; then
  TAG="--tag beta"
fi

echo TAG = $TAG
# Monte the legacy Artifactory config and publish
AWS_PROFILE=cb-serviceregistry-nonprod npx artifactory-manager activateLegacyArtifactory
npm publish $TAG

# Monte the SAAS Artifactory config and publish
AWS_PROFILE=cb-serviceregistry-nonprod npx artifactory-manager activateSaasArtifactory
npm publish $TAG

# Restore the default .npmrc and clean up ephemeral profiles
npx artifactory-manager restoreDefaultProfile
