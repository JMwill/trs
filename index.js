#!/usr/bin/env node

const program       = require('commander');
const chalk         = require('chalk');
const helper        = require('./helper');

function trans(words, to='en') {
    helper.detectlang(words)
        .then(from => {
            if (from === to) {
                console.log(chalk.blue(words));
                process.exit(0);
            } else {
                return helper.makeTransOpt(from, to, words);
            }
        })
        .then(transOpt => {
            return helper.translate(transOpt)
        })
        .then(result => {
            console.log(chalk.blue(result));
            process.exit(0);
        })
        .catch(err => {
            console.log(chalk.bold.red(err));
            process.exit(1);
        });
}

program
    .arguments('[words...]')
    .version('0.0.1')
    .option('-t --transto [lang]', 'translate to particular language')
    .action(function (words) {
        let searchWords = words.join(' ');
        trans(searchWords, program.transto);
    })
    .parse(process.argv);