#!/usr/bin/env node

const co        = require('co');
const prompt    = require('co-prompt');
const request   = require('superagent');
const program   = require('commander');

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
                    let link = res.body.links.html.href;
                    console.log('Snippet created: %s', link);
                });
        });
    })
    .parse(process.argv)