/**
 * Build content for `.npmrc` for a single scope with a legacy auth token
 *
 * @param {object} args
 * @param {string} args.authToken The auth token after logging in via `npm login` or equivalent
 * @param {string} args.registryUrl NPM registry URL
 * @param {string} args.scope NPM scope
 *
 * Has body shape of:
 * ```
 *   @ce:registry=https://artifactory.collegeboard.org/api/npm/ce-npm-local/
 *   //artifactory.collegeboard.org/api/npm/ce-npm-local/:_authToken=[authToken]
 *   email = cops@collegeboard.org
 *   always-auth = true
 * ```
 */
export const buildScopedLegacyNpmrcContent = ({ authToken, registryUrl, scope }) => {
  const repoName = /^http?s:(.+\/npm\/.*)$/.exec(registryUrl)[1];
  const npmrcEntry =
    `@${scope}:registry=${registryUrl}\n${repoName}:_authToken=${authToken}\nemail = cops@collegeboard.org\nalways-auth = true\n`;

  return npmrcEntry;
};

/**
 * Build content for `.npmrc` for a single scope with an auth token
 *
 * @param {object} args
 * @param {string} args.password The password for the users
 * @param {string} args.username The username for the service user
 * @param {string} args.email The email for the service user (may be the same as the user)
 * @param {string} args.registryUrl NPM registry URL
 * @param {string} args.scope NPM scope
 *
 * Has body shape of:
 * ```
 *  @ce:registry=https://artifactory-saas.collegeboard.org/artifactory/api/npm/ce-npm-local/
 *  //artifactory-saas.collegeboard.org/artifactory/api/npm/ce-npm-local/:_password=[password]
 *  //artifactory-saas.collegeboard.org/artifactory/api/npm/ce-npm-local/:username=svc-ceuser@collegeboard.org
 *  //artifactory-saas.collegeboard.org/artifactory/api/npm/ce-npm-local/:email=svc-ceuser@collegeboard.org
 *  //artifactory-saas.collegeboard.org/artifactory/api/npm/ce-npm-local/:always-auth=true
 * ```
 */
export const buildScopedNpmrcEntry = ({ password, username, email, registryUrl, scope }) => {
  const repoName = /^http?s:(.+\/npm\/.*)$/.exec(registryUrl)[1];
  const npmrcEntry =
    `@${scope}:registry=${registryUrl}\n${repoName}:_password=${password}\n${repoName}:username=${username}\n${repoName}:email=${email}\n${repoName}:always-auth=true\n`;

  return npmrcEntry;
};
