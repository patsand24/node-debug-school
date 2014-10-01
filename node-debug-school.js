#!/usr/bin/env node

// Copyright Joyent, Inc. and other node-debug-school contributors. All
// rights reserved. Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
 * Because workshopper hard codes command line arguments handling,
 * we need to to our own and remove any extra command line arguments we support
 * before workshopper parses the command line
 */
var argv = require('minimist')(process.argv.slice(2));
var devMode = false;
if (argv.dev) {
  devMode = true;
  process.argv.splice(process.argv.indexOf('--dev'), 1);
}

var path        = require('path');

var workshopper = require('workshopper');

var menu        = require('./exercises/menu');
var platform    = require('./lib/platform/platform.js');
var progressMsg = require('./lib/progress/progressmsg.js');

var subtitle = '\x1b[23mSelect an exercise and hit \x1b[3mEnter\x1b[23m to begin';

function fullPath(relPath) {
  return path.join(__dirname, relPath);
}

function startWorkshop() {
  workshopper({
      name        : 'node-debug-school'
    , title       : 'NODE.JS DEBUGGING ON STEROIDS'
    , subtitle    : subtitle
    , exerciseDir : fullPath('./exercises/')
    , appDir      : __dirname
    , helpFile    : fullPath('help.txt')
    , footerFile  : fullPath('footer.md')
  });
}


if (devMode) {
  startWorkshop();
} else {
  var platformCheckMsg = 'Checking if platform is supported';
  var platformCheckProgress = progressMsg.startProgressMsg(platformCheckMsg,
                                                         300);
  platform.checkPlatformSupported(function platformCheckDone(err, platformSupported) {
    progressMsg.stopProgressMsg(platformCheckProgress);

    if (platformSupported) {
      startWorkshop();
    } else {
      console.error('Sorry, your current platform is not supported.');
    }
  });
}
