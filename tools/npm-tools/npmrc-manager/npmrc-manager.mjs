import fs from 'fs';
import path from 'path';
import { HOME_DIR, NPMRC_FILE, NPMRC_FILENAME } from './const.mjs';

const RC_DIR = path.join(HOME_DIR, '.npmrc_manager');
const DEFAULT_PROFILE = 'default';

const resolveProfileFileName = (profileName) => {
  return path.join(RC_DIR, `${profileName}_${NPMRC_FILENAME}`);
}

const init = () => {
  if (!fs.existsSync(RC_DIR)) {
    fs.mkdirSync(RC_DIR);
    const defaultFilePath = resolveProfileFileName(DEFAULT_PROFILE);
    if (fs.existsSync(NPMRC_FILE)) {
      fs.copyFileSync(NPMRC_FILE, defaultFilePath);
      fs.rmSync(NPMRC_FILE);
    } else {
      fs.writeFileSync(defaultFilePath, '', 'utf-8');
    }

    fs.symlinkSync(defaultFilePath, NPMRC_FILE);
  }
};

const createNpmrcProfile = (profileName) => {
  init();
  const profilePath = resolveProfileFileName(profileName);
  fs.writeFileSync(profilePath, '', 'utf-8');
};

const activateNpmrcProfile = (profileName) => {
  init();

  let created = false;

  const profileFilePath = resolveProfileFileName(profileName);
  if (!fs.existsSync(profileFilePath)) {
    created = true;
    createNpmrcProfile(profileName);
  }
  fs.rmSync(NPMRC_FILE);
  fs.symlinkSync(profileFilePath, NPMRC_FILE);

  return {
    created,
    profileFilePath
  };
};

const deleteNpmrcProfile = (profileName) => {
  const profilePath = resolveProfileFileName(profileName);
  if (fs.existsSync(profilePath)) {
    if (fs.readlinkSync(NPMRC_FILE) === profilePath) {
      throw new Error('You cannot delete a profile that is active.  Please activate another profile or restore the default profile first');
    }
    fs.rmSync(profilePath);
  }
};

const replaceNpmrcContentForProfile = (profileName, content) => {
  const profilePath = resolveProfileFileName(profileName);
  fs.writeFileSync(profilePath, content, 'utf-8');
}

const restoreDefaultProfile = () => {
  activateNpmrcProfile(DEFAULT_PROFILE);
}

export const NpmrcManager = {
  resolveProfileFileName,
  createNpmrcProfile,
  activateNpmrcProfile,
  deleteNpmrcProfile,
  replaceNpmrcContentForProfile,
  restoreDefaultProfile,
};
