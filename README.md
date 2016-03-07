![typhonjs-github-orgs-gulptasks](http://i.imgur.com/z4EUE0H.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-github-orgs-gulptasks.svg?label=npm)](https://www.npmjs.com/package/typhonjs-github-orgs-gulptasks)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs/typhonjs-github-orgs-gulptasks/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-gulp/typhonjs-github-orgs-gulptasks.svg?branch=master)](https://travis-ci.org/typhonjs-node-gulp/typhonjs-github-orgs-gulptasks)
[![Dependency Status](https://www.versioneye.com/user/projects/56dcc8a6309a580038b000cc/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56dcc8a6309a580038b000cc)

Provides GitHub many organization / repos gulp tasks shared by TyphonJS and beyond.

The `transform` Gulp tasks are optional and only load if the following NPM modules are installed:
- [typhonjs-github-inspect-orgs](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs)
- [typhonjs-github-inspect-orgs-transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)

The following are example entries in `package.json`:
```
  "dependencies": {
    "typhonjs-github-inspect-orgs": "^0.0.9"
    "typhonjs-github-inspect-orgs-transform": "^0.0.4"
  },
  "devDependencies": {
    "gulp": "^3.9.1",
    "typhonjs-github-orgs-gulptasks": "^0.0.5",
    "typhonjs-npm-build-test": "^0.0.9"
  },
```

An example `gulpfile.babel.js` initializing the transform tasks:
```
import fs            from 'fs';
import gulp          from 'gulp';

import gitGulpTasks  from 'typhonjs-github-orgs-gulptasks';

// Import all GitHub Orgs gulp tasks

// Loads owner / user public access tokens from environment variables or from `./token.owner` and `./token.user` in
// the root directory.
let ownerCredential = process.env.GITHUB_OWNER_TOKEN;
let userCredential = process.env.GITHUB_USER_TOKEN;

// If user ownerCredential is still undefined attempt to load from a local file `./owner.token`.
if (typeof ownerCredential === 'undefined')
{
   try { ownerCredential = fs.readFileSync('./token.owner', 'utf-8'); }
   catch(err) { /* ... */ }
}

// If user userCredential is still undefined attempt to load from a local file `./user.token`.
if (typeof userCredential === 'undefined')
{
   try { userCredential = fs.readFileSync('./token.user', 'utf-8'); }
   catch(err) { /* ... */ }
}

// Fail now if we don't have an owner token.
if (typeof ownerCredential !== 'string')
{
   throw new TypeError('No owner credentials found in `process.env.GITHUB_OWNER_TOKEN` or `./token.owner`.');
}

// Fail now if we don't have a user token.
if (typeof userCredential !== 'string')
{
   throw new TypeError('No user credentials found in `process.env.GITHUB_USER_TOKEN` or `./token.user`.');
}

// Defines TyphonJS organizations.
const organizations = [{ credential: ownerCredential, owner: 'typhonrt', regex: '^typhonjs' }];

// Import all tasks and set `rootPath` to the base project path and `srcGlob` to all JS sources in `./src`.
gitGulpTasks(gulp,
{
   rootPath: __dirname,
   importTasks: ['transform'],
   inspectOptions: { ctor: { organizations, verbose: true } },
   transformOptions: { ctor: { transformType: 'text' },  methods: { credential: userCredential } }
});
```

The above example Gulp file uses Babel / ES6 which is installed by `typhonjs-npm-build-test`. To configure the GitHub Orgs Gulp tasks a `owner` and `user` GitHub public access token containing `public_repo` and `read:org` permissions is either set as environment variables (useful for Travis CI testing) in `process.env.GITHUB_OWNER_TOKEN` and `process.env.GITHUB_USER_TOKEN` or in local files `./token.owner` and `./token.user`. It should be noted that if storing public access tokens in local files that the given project should include a `.gitignore` file that prevents checking them in as GitHub will invalidate those tokens if they are checked as part of a commit. 

In particular regarding configuration please review:
```
// Import all tasks and set `rootPath` to the base project path.
gitGulpTasks(gulp,
{
   rootPath: __dirname,
   importTasks: ['transform'],
   inspectOptions: { ctor: { organizations, verbose: true } },
   transformOptions: { ctor: { transformType: 'text' },  methods: { credential: userCredential } }
});
```

The second parameter to `gitGulpTasks` is an options hash that must contains:
```
@param {object} options - Optional parameters:

(object)          inspectOptions - Hash of options for GitHubInspectOrgs with following categories:

   (object)       ctor - Constructor options for GitHubInspectOrgs creation.

(object)          transformOptions - Hash of options for GitHubInspectOrgsTransform with following categories:

   (object)       ctor - Constructor options for GitHubInspectOrgsTransform creation.

   (object)       methods - Options passed into GitHubInspectOrgsTransform method invocation. `All` methods
                            remove `credentials`.

   (object)       tasks - Options specific to controlling task creation below:

      (boolean)   skipNonCredentialTasks - If true then skip all tasks that don't require credentials.
```

Please review the documentation for options available for:
- `inspectOptions`: [typhonjs-github-inspect-orgs](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs)
- `transformOptions`: [typhonjs-github-inspect-orgs-transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)

The following is a description of all imported Gulp tasks for `typhonjs-github-inspect-orgs-transform` with links to related documentation from [typhonjs-github-inspect-orgs-transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform):

- [github-transform-collaborators-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getCollaborators) - Transforms all collaborators across all organizations.
- [github-transform-collaborators-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getCollaborators) - Transforms all collaborators across all organizations w/ `userCredential`.
- [github-transform-contributors-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getContributors) - Transforms all contributors across all organizations.
- [github-transform-contributors-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getContributors) - Transforms all contributors across all organizations w/ `userCredential`.
- [github-transform-members-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getMembers) - Transforms all organization members across all organizations.
- [github-transform-members-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getMembers) - Transforms all organization members across all organizations w/ `userCredential`.
- [github-transform-org-members-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgMembers) - Transforms all members by organization across all organizations.
- [github-transform-org-members-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgMembers) - Transforms all members by organization across all organizations w/ `userCredential`.
- [github-transform-org-repo-collaborators-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoCollaborators) - Transforms all collaborators by repo by organization across all organizations.
- [github-transform-org-repo-collaborators-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoCollaborators) - Transforms all collaborators by repo by organization across all organizations w/ `userCredential`.
- [github-transform-org-repo-contributors-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoContributors) - Transforms all contributors by repo by organization across all organizations.
- [github-transform-org-repo-contributors-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoContributors) - Transforms all contributors by repo by organization across all organizations w/ `userCredential`.
- [github-transform-org-repo-stats-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoStats) - Transforms GitHub statistics by repo by organization across all organizations.
- [github-transform-org-repo-stats-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepoStats) - Transforms GitHub statistics by repo by organization across all organizations w/ `userCredential`.
- [github-transform-org-repos-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepos) - Transforms all repos by organization across all organizations.
- [github-transform-org-repos-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgRepos) - Transforms all repos by organization across all organizations w/ `userCredential`.
- [github-transform-org-team-members-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgTeamMembers) - Transforms all members by team by organization across all organizations.
- [github-transform-org-team-members-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgTeamMembers) - Transforms all members by team by organization across all organizations w/ `userCredential`.
- [github-transform-org-teams-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgTeams) - Transforms all teams by organization across all organizations.
- [github-transform-org-teams-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgTeams) - Transforms all teams by organization across all organizations w/ `userCredential`.
- [github-transform-orgs-all](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgs) - Transforms all organizations.
- [github-transform-orgs-user](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOrgs) - Transforms all organizations w/ `userCredential`.
- [github-transform-owner-orgs](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOwnerOrgs) - Transforms all organizations by organization owner.
- [github-transform-owners](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOwners) - Transforms all organization owners.
- [github-transform-owners-rate-limit](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getOwnerRateLimits) - Transforms the current rate limits for all organization owners.
- [github-transform-user-from-credential](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/README.md#getUserFromCredential) - Transforms the GitHub user who owns the provided `userCredential`.

