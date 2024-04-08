import chalk from 'chalk';
import { NpmrcManager } from '../npmrc-manager/npmrc-manager.mjs';
import { LEGACY_PROFILE_NAME, SAAS_PROFILE_NAME } from './const.mjs';
import { fetchArtifactorySecret } from './get-npm-secret.mjs';
import { buildScopedNpmrcEntry, buildScopedLegacyNpmrcContent } from '../npm-auth/npmrc-util.mjs';
import { loginNpmBasicAuth } from '../npm-auth/basic-auth.mjs';
import { CE_SCOPE, LEGACY_REGISTRY_URL, SAAS_REGISTRY_URL } from './const.mjs';
import fs from 'fs';

/**
 * Use {@link NpmrcManager} to build a managed .npmrc that has credentials for `@ce` scope legacy Artifactory
 */
const npmAuthLegacyArtifactory = async () => {
  // Activate the legacy `.npmrc`
  NpmrcManager.activateNpmrcProfile(LEGACY_PROFILE_NAME);

  // Look up the legacy credentials
  const { logonName: username, logonPassword: password } = await fetchArtifactorySecret('legacy');

  // Log in
  const authToken = await loginNpmBasicAuth({ registryUrl: LEGACY_REGISTRY_URL, username, password });

  // Write the file content to the profile managed by npmrc-manager
  const outputString = buildScopedLegacyNpmrcContent({
    authToken,
    scope: CE_SCOPE,
    registryUrl: LEGACY_REGISTRY_URL,
  });

  fs.writeFileSync(NpmrcManager.resolveProfileFileName(LEGACY_PROFILE_NAME), outputString);

  console.info(chalk.green(`Updated .npmrc via NpmrcManager profile '${LEGACY_PROFILE_NAME}' to use legacy Artifactory for '${CE_SCOPE}' scope`));
};

/**
 * Use {@link NpmrcManager} to build a managed .npmrc that has credentials for `@ce` scope SAAS Artifactory
 */
const npmAuthSaasArtifactory = async () => {
  // Activate the SAAS `.npmrc`
  NpmrcManager.activateNpmrcProfile(SAAS_PROFILE_NAME);

  // Look up the legacy credentials
  const { logonPassword, logonName } = await fetchArtifactorySecret('saas');

  // Write the file content to the profile managed by npmrc-manager
  const outputString = buildScopedNpmrcEntry({
    password: logonPassword,
    username: logonName,
    email: logonName,
    scope: CE_SCOPE,
    registryUrl: SAAS_REGISTRY_URL,
  });

  fs.writeFileSync(NpmrcManager.resolveProfileFileName(SAAS_PROFILE_NAME), outputString);

  console.info(chalk.green(`Updated .npmrc via NpmrcManager profile '${SAAS_PROFILE_NAME}' to use SAAS Artifactory for '${CE_SCOPE}' scope`));
};

const restoreDefaultProfile = () => {
  NpmrcManager.restoreDefaultProfile();
  NpmrcManager.deleteNpmrcProfile(LEGACY_PROFILE_NAME);
  NpmrcManager.deleteNpmrcProfile(SAAS_PROFILE_NAME);
  console.info(chalk.green(`Default .npmrc profile restored`));
};

export const ArtifactoryNpmAuthUtil = {
  npmAuthLegacyArtifactory,
  npmAuthSaasArtifactory,
  restoreDefaultProfile,
};
