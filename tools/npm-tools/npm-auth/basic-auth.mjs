import { login } from 'npm-profile';
import { DEBUG } from '../const.mjs';
import chalk from 'chalk';

/**
 * Log in to an NPM repository (basic auth) and return the auth token
 *
 * @param {object} args
 * @param {string} args.registryUrl NPM registry URL
 * @param {string} args.scope NPM scope
 * @param {string} args.username
 * @param {string} args.password
 * @return {Promise<string>}
 */
export const loginNpmBasicAuth = async ({ registryUrl, scope, username, password }) => {
  if (DEBUG) {
    process.on('log', (level, feature, ...args) => {
      console.log(level, feature, ...args);
    });
  }

  try {
    const loginRes = await login(
      async () => {},
      async () => ({ username, password }),
      {
        scope: `@${scope}`,
        [`@${scope}:registry`]: registryUrl,
        spec: registryUrl,
      },
    );

    if (!loginRes.ok) {
      throw new Error(chalk.red(`writeLegacyNpmrc: Error authenticating: ${JSON.stringify(loginRes)}`));
    }

    return loginRes.token.toString();
  } finally {
    if (DEBUG) {
      process.on('log', () => {
      });
    }
  }
};
