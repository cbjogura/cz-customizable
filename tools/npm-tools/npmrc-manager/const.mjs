import os from 'os';
import path from 'path';

export const HOME_DIR = os.homedir();
export const NPMRC_FILENAME = 'npmrc';
export const NPMRC_FILE = path.join(HOME_DIR, `.${NPMRC_FILENAME}`);
