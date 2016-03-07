'use strict';

let GitHubInspectOrgs, GitHubInspectOrgsTransform;

// Require is used here as the following are implicit dependencies and loading of the Gulp tasks will exit out early
// if the following fails.
try
{
   GitHubInspectOrgs =          require('typhonjs-github-inspect-orgs');
   GitHubInspectOrgsTransform = require('typhonjs-github-inspect-orgs-transform');
}
catch (err) { /* ... */ }

/**
 * Provides a function to create Gulp tasks for GitHubInspectOrgsTransform.
 *
 * @param {object} gulp - An instance of Gulp.
 *
 * @param {object} options - Optional parameters:
 * ```
 * (object)          inspectOptions - Hash of options for GitHubInspectOrgs with following categories:
 *
 *    (object)       ctor - Constructor options for GitHubInspectOrgs creation.
 *
 * (object)          transformOptions - Hash of options for GitHubInspectOrgsTransform with following categories:
 *
 *    (object)       ctor - Constructor options for GitHubInspectOrgsTransform creation.
 *
 *    (object)       methods - Options passed into GitHubInspectOrgsTransform method invocation. `All` methods
 *                             remove `credentials`.
 *
 *    (object)       tasks - Options specific to controlling task creation below:
 *
 *       (boolean)   skipNonCredentialTasks - If true then skip all tasks that don't require credentials.
 * ```
 *
 * Please review the documentation for options available for:
 *
 * - `inspectOptions`: [typhonjs-github-inspect-orgs](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs)
 * - `transformOptions`: [typhonjs-github-inspect-orgs-transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)
 */
export default function(gulp, options)
{
   // If GitHubInspectOrgs or GitHubInspectOrgsTransform are not required then exit early.
   if (typeof GitHubInspectOrgs === 'undefined' || typeof GitHubInspectOrgsTransform === 'undefined')
   {
      console.log('githubTransform warning: Could not import GitHubInspectOrgs or GitHubInspectOrgsTransform');
      return;
   }

   // Since both of these resources are required versus imported map the ES6 default module namespace.
   GitHubInspectOrgs = GitHubInspectOrgs.default;
   GitHubInspectOrgsTransform = GitHubInspectOrgsTransform.default;

   if (typeof gulp !== 'object' && typeof gulp.task !== 'function')
   {
      throw new TypeError(`githubTransform error: 'gulp' does not conform to the Gulp API.`);
   }

   if (typeof options !== 'object')
   {
      throw new TypeError(`githubTransform error: 'options' is not a 'object'.`);
   }

   if (typeof options.inspectOptions !== 'object' || typeof options.inspectOptions.ctor !== 'object')
   {
      console.log(`githubTransform warning: 'options.inspectOptions' is not an 'object'.`);
      return;
   }

   if (typeof options.transformOptions !== 'object')
   {
      console.log(`githubTransform warning: 'options.transformOptions' is not an 'object'.`);
      return;
   }

   const inspectOptions = options.inspectOptions.ctor;

   const tCtorOpts = typeof options.transformOptions.ctor === 'object' ? options.transformOptions.ctor : {};
   const tMethodOpts = typeof options.transformOptions.methods === 'object' ? options.transformOptions.methods : {};
   const tTaskOpts = typeof options.transformOptions.tasks === 'object' ? options.transformOptions.tasks : {};

   // Set default values
   tMethodOpts.categories = Array.isArray(tMethodOpts.categories) ? tMethodOpts.categories : ['all'];
   tMethodOpts.description = typeof tMethodOpts.description === 'boolean' ? tMethodOpts.description : false;
   tMethodOpts.pipeFunction = typeof tMethodOpts.pipeFunction === 'function' ? tMethodOpts.pipeFunction : console.log;

   tTaskOpts.skipNonCredentialTasks = typeof tTaskOpts.skipNonCredentialTasks === 'boolean' ?
    tTaskOpts.skipNonCredentialTasks : false;

   // Create an instance of GitHubInspectOrgsTransform passing an instance of GitHubInspectOrgs and options.
   const inspectTransform = new GitHubInspectOrgsTransform(new GitHubInspectOrgs(inspectOptions), tCtorOpts);

   // Potentially skip non-credentialed tasks.

   if (!tTaskOpts.skipNonCredentialTasks)
   {
      // Must remove credential option from transformOptions for `all` tasks.
      const allOptions = {};
      for (const key in tMethodOpts) { allOptions[key] = tMethodOpts[key]; }
      delete allOptions['credential'];

      /**
       * Transforms normalized `getCollaborators`.
       */
      gulp.task('github-transform-collaborators-all', () =>
      {
         return inspectTransform.getCollaborators(allOptions);
      });

      /**
       * Transforms normalized `getContributors`.
       */
      gulp.task('github-transform-contributors-all', () =>
      {
         return inspectTransform.getContributors(allOptions);
      });

      /**
       * Transforms normalized `getMembers`.
       */
      gulp.task('github-transform-members-all', () =>
      {
         return inspectTransform.getMembers(allOptions);
      });

      /**
       * Transforms normalized `getOrgMembers`.
       */
      gulp.task('github-transform-org-members-all', () =>
      {
         return inspectTransform.getOrgMembers(allOptions);
      });

      /**
       * Transforms normalized `getOrgRepoCollaborators`.
       */
      gulp.task('github-transform-org-repo-collaborators-all', () =>
      {
         return inspectTransform.getOrgRepoCollaborators(allOptions);
      });

      /**
       * Transforms normalized `getOrgRepoContributors`.
       */
      gulp.task('github-transform-org-repo-contributors-all', () =>
      {
         return inspectTransform.getOrgRepoContributors(allOptions);
      });

      /**
       * Transforms normalized `getOrgRepoStats`.
       */
      gulp.task('github-transform-org-repo-stats-all', () =>
      {
         return inspectTransform.getOrgRepoStats(allOptions);
      });

      /**
       * Transforms normalized `getOrgRepos`.
       */
      gulp.task('github-transform-org-repos-all', () =>
      {
         return inspectTransform.getOrgRepos(allOptions);
      });

      /**
       * Transforms normalized `getOrgTeams`.
       */
      gulp.task('github-transform-org-teams-all', () =>
      {
         return inspectTransform.getOrgTeams(allOptions);
      });

      /**
       * Transforms normalized `getOrgTeamMembers`.
       */
      gulp.task('github-transform-org-team-members-all', () =>
      {
         return inspectTransform.getOrgTeamMembers(allOptions);
      });

      /**
       * Transforms normalized `getOrgs`.
       */
      gulp.task('github-transform-orgs-all', () =>
      {
         return inspectTransform.getOrgs(allOptions);
      });

      /**
       * Transforms normalized `getOwnerOrgs`.
       */
      gulp.task('github-transform-owner-orgs', () =>
      {
         return inspectTransform.getOwnerOrgs(allOptions);
      });

      /**
       * Transforms normalized `getOwners`.
       */
      gulp.task('github-transform-owners', () =>
      {
         return inspectTransform.getOwners(allOptions);
      });

      /**
       * Transforms normalized `getOwnerRateLimits`.
       */
      gulp.task('github-transform-owners-rate-limit', () =>
      {
         return inspectTransform.getOwnerRateLimits(allOptions);
      });
   }

   // If no credential string is supplied then skip credentialed Gulp tasks.
   if (typeof tMethodOpts.credential === 'string')
   {
      /**
       * Transforms normalized `getCollaborators` with user credentials.
       */
      gulp.task('github-transform-collaborators-user', () =>
      {
         return inspectTransform.getCollaborators(tMethodOpts);
      });

      /**
       * Transforms normalized `getContributors` with user credentials.
       */
      gulp.task('github-transform-contributors-user', () =>
      {
         return inspectTransform.getContributors(tMethodOpts);
      });

      /**
       * Transforms normalized `getMembers` with user credentials.
       */
      gulp.task('github-transform-members-user', () =>
      {
         return inspectTransform.getMembers(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgMembers` with user credentials.
       */
      gulp.task('github-transform-org-members-user', () =>
      {
         return inspectTransform.getOrgMembers(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgRepoCollaborators` with user credentials.
       */
      gulp.task('github-transform-org-repo-collaborators-user', () =>
      {
         return inspectTransform.getOrgRepoCollaborators(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgRepoContributors` with user credentials.
       */
      gulp.task('github-transform-org-repo-contributors-user', () =>
      {
         return inspectTransform.getOrgRepoContributors(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgRepoStats` with user credentials.
       */
      gulp.task('github-transform-org-repo-stats-user', () =>
      {
         return inspectTransform.getOrgRepoStats(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgRepos` with user credentials.
       */
      gulp.task('github-transform-org-repos-user', () =>
      {
         return inspectTransform.getOrgRepos(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgTeams` with user credentials.
       */
      gulp.task('github-transform-org-teams-user', () =>
      {
         return inspectTransform.getOrgTeams(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgTeamMembers` with user credentials.
       */
      gulp.task('github-transform-org-team-members-user', () =>
      {
         return inspectTransform.getOrgTeamMembers(tMethodOpts);
      });

      /**
       * Transforms normalized `getOrgs` with user credentials.
       */
      gulp.task('github-transform-orgs-user', () =>
      {
         return inspectTransform.getOrgs(tMethodOpts);
      });

      /**
       * Transforms normalized `getUserFromCredential` with user credentials.
       */
      gulp.task('github-transform-user-from-credential', () =>
      {
         return inspectTransform.getUserFromCredential(tMethodOpts);
      });
   }
}