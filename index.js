#!/usr/bin/env node

const co        = require('co');
const prompt    = require('co-prompt');
const request   = require('superagent');
const program   = require('commander');
const chalk     = require('chalk');

program
    .arguments('<file>')
    .option('-u, --username <username>', 'The user to authenticate as')
    .option('-p, --password <password>', 'The user\'s password')
    .action(function (file) {
        co(function *() {
            let username = yield prompt('username: ');
            let password = yield prompt.password('password: ');
            request
                .post('https://api.bitbucket.org/2.0/snippets/')
                .auth(username, password)
                .attach('file', file)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (!err && res.ok) {
                        let link = res.body.links.html.href;
                        console.log(chalk.bold.cyan('Snippet created: ') + link);
                        process.exit(0);
                    }

                    let errMessage;
                    if (res && res.status === 401) {
                        errMessage = 'Authentication failed Bad username/password?';
                    } else if (err) {
                        errMessage = err;
                    } else {
                        errMessage = res.text;
                    }
                    console.error();
                    console.log(chalk.red(errMessage));
                    process.exit(1);
                });
        });
    })
    .parse(process.argv)