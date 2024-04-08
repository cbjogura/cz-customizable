import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { USE_LOCALSTACK } from '../const.mjs';
import chalk from 'chalk';

const secretSuffix = USE_LOCALSTACK ? 'local' : 'dev';

const LEGACY_SECRET_NAME = `artifactory-svc-ceuser-credentials-${secretSuffix}`;
const SASS_SECRET_NAME = `artifactory-saas-svc-ceuser-credentials-${secretSuffix}`;

const config = USE_LOCALSTACK
  ? {
    endpoint: 'http://127.0.0.1:4566',
    credentials: {
      region: 'us-east-1',
      accessKeyId: 'foo',
      secretAccessKey: 'bar',
    },
  }
  : undefined;

/**
 * @typedef ArtifactoryLogonSecret
 * @type {object}
 * @property {string} userName Artifactory user name
 * @property {string} logonName Artifactory logon name
 * @property {string} logonPassword Artifactory logon password
 * @property {string} identityToken Identity token to use in lieu of credentials generated via `npm login`
 */

/**
 * @param {'legacy' | 'saas'} secretType
 * @return {Promise<ArtifactoryLogonSecret>}
 */
export const fetchArtifactorySecret = async (secretType) => {
  const client = new SecretsManagerClient(config);

  const SecretId = secretType === 'saas' ? SASS_SECRET_NAME : LEGACY_SECRET_NAME;

  console.info(chalk.green(`Getting secret value for '${SecretId}'`));

  try {
    const command = new GetSecretValueCommand({
      SecretId,
    });

    const res = await client.send(command);

    return JSON.parse(res.SecretString);
  } finally {
    client.destroy();
  }
};
