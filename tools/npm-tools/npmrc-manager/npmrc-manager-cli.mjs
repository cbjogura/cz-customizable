#!/usr/bin/env node

import { NpmrcManager } from './npmrc-manager.mjs';
import { createCommand, program } from 'commander';
import chalk from 'chalk';

program
  .name('npmrc-manager-cli')
  .description('CLI to create/switch .npmrc files');

const activateNpmrcProfileCommand = createCommand('activate')
  .description('Activate a new .npmrc profile - will create the profile if it does not exist')
  .argument('<profileName>', 'The profile name to use' )
  .action((profileName) => {
    const { created } = NpmrcManager.activateNpmrcProfile(profileName);
    console.info(chalk.green(`Profile '${profileName}' ${created ? 'created and ' : ''}activated`));
  });

const createNpmrcProfileCommand = createCommand('create')
  .description('Create a new .npmrc profile')
  .argument('<profileName>', 'The profile name to use' )
  .action((profileName) => {
    NpmrcManager.createNpmrcProfile(profileName);
  });

const deleteNpmrcProfileCommand = createCommand('delete')
  .description('Delete an .npmrc profile')
  .argument('<profileName>', 'The profile name to use' )
  .action((profileName) => {
    NpmrcManager.deleteNpmrcProfile(profileName);
    console.info(chalk.green(`Profile ${profileName} deleted`));
  });

const restoreDefaultNpmrcProfileCommand = createCommand('restoreDefault')
  .description('Restore the default.npmrc profile')
  .action(() => {
    NpmrcManager.restoreDefaultProfile();
    console.info(chalk.green(`Profile 'default' activated`));
  });

program.addCommand(activateNpmrcProfileCommand);
program.addCommand(createNpmrcProfileCommand);
program.addCommand(deleteNpmrcProfileCommand);
program.addCommand(restoreDefaultNpmrcProfileCommand);

program.parse(process.argv);

