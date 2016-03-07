/**
 * Please see `typhonjs-github-orgs-gulptasks` (https://www.npmjs.com/package/typhonjs-github-orgs-gulptasks)
 */
import fs            from 'fs';
import gulp          from 'gulp';

import gulpTasks     from './src/index.js';

import taskListing   from 'gulp-task-listing';


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
gulpTasks(gulp,
{
   rootPath: __dirname,
   importTasks: ['transform'],
   inspectOptions: { ctor: { organizations, verbose: true } },
   transformOptions: { ctor: { transformType: 'text' },  methods: { credential: userCredential } }
});


// For testing ------------------------------------------------------------------------------------------------------

/**
 * Generates task listing
 */
gulp.task('local-test', () =>
{
   taskListing.withFilters(null, ['local-test', 'verify-test'])();
});

/**
 * Verifies task listing data
 */
gulp.task('verify-test', () =>
{
   const testData = fs.readFileSync('./test/testdata.txt', 'utf8');
   const matchData = fs.readFileSync('./test/matchdata.txt', 'utf8');

   if (matchData !== testData)
   {
      console.log('Verification failed');
      process.exit(1);
   }
   else
   {
      console.log('Verification passed');
   }
});