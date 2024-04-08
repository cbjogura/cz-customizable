import os from 'os';
import path from 'path';


export const USE_LOCALSTACK = process.env.AWS_PROFILE === 'localstack';

export const DEBUG = process.env.DEBUG === 'true';


