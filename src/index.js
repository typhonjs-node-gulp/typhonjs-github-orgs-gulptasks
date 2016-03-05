'use strict';

import childProcess     from 'child_process';
import os               from 'os';

import githubTransform  from './githubTransform.js';

/**
 * Requires all Gulp tasks.
 *
 * Required parameters include:
 * Additional optional parameters include:
 *
 * @param {object}   gulp     - An instance of Gulp.
 *
 * @param {object}   options  - Optional parameters:
 * ```
 * `importTasks` -  may be supplied which specifies which categories of tasks to require. This allows only exposing
 * certain tasks that are relevant for a given project. Available task categories include: 'transform'.
 * ```
 */
export default function(gulp, options)
{
   options =                  options || {};
   options.importTasks =      options.importTasks || ['transform'];

   options.loadedTasks =      [];   // Stores loaded task names.
   options.topLevelModules =  {};   // Stores top level module info.

   const rootPath =             options.rootPath;

   // Parses top level modules installed in `node_modules` and provides an object hash of name -> version in
   // `options.topLevelModules`.

   let moduleList;

   try
   {
      moduleList = childProcess.execSync('npm list --depth=0', { cwd: rootPath, encoding: 'utf8' });
   }
   catch (err) { /* ... */ }

   if (moduleList)
   {
      const lines = moduleList.split(os.EOL);
      const regex = /([\S]+)@([\S]+)/;

      for (let cntr = 1; cntr < lines.length; cntr++)
      {
         const results = regex.exec(lines[cntr]);
         if (results && results.length >= 3) { options.topLevelModules[results[1]] = results[2]; }
      }
   }

   s_ADD_TASKS(gulp, options);
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Dispatches and add tasks defined in `options.importTasks`.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
const s_ADD_TASKS = (gulp, options) =>
{
   for (let cntr = 0; cntr < options.importTasks.length; cntr++)
   {
      switch (options.importTasks[cntr])
      {
         case 'transform':
            githubTransform(gulp, options);
            break;
      }
   }
};