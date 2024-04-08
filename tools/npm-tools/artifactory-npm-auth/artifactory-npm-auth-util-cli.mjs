#!/usr/bin/env node

import { createCommand, program } from 'commander';
import { ArtifactoryNpmAuthUtil } from './artifactory-npm-auth-util.mjs';

program
  .name('artifactory-npm-auth-util-cli')
  .description('CLI to create/switch .npmrc files');

const activateLegacyArtifactory = createCommand('activateLegacyArtifactory')
  .description('Activate legacy artifactory via .npmrc manager and friends')
  .action(async () => {
    await ArtifactoryNpmAuthUtil.npmAuthLegacyArtifactory();
  });

const activateSaasArtifactory = createCommand('activateSaasArtifactory')
  .description('Activate SAAS artifactory via .npmrc manager and friends')
  .action(async () => {
    await ArtifactoryNpmAuthUtil.npmAuthSaasArtifactory();
  });

const restoreDefaultProfile = createCommand('restoreDefaultProfile')
  .description('Restore the default .npmrc profile via manager')
  .action(async () => {
    ArtifactoryNpmAuthUtil.restoreDefaultProfile();
  });

program.addCommand(activateLegacyArtifactory);
program.addCommand(activateSaasArtifactory);
program.addCommand(restoreDefaultProfile);

await program.parseAsync(process.argv);
