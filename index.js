#!/usr/bin/env node

const program       = require('commander');
const chalk         = require('chalk');
const helper        = require('./helper');
const ora           = require('ora');

let langMap = {
    ara: "阿拉伯语",
    auto: "自动检测",
    bul: "保加利亚语",
    cht: "繁体中文",
    cs: "捷克语",
    dan: "丹麦语",
    de: "德语",
    el: "希腊语",
    en: "英语",
    est: "爱沙尼亚语",
    fin: "芬兰语",
    fra: "法语",
    hu: "匈牙利语",
    it: "意大利语",
    jp: "日语",
    kor: "韩语",
    nl: "荷兰语",
    pl: "波兰语",
    pt: "葡萄牙语",
    rom: "罗马尼亚语",
    ru: "俄语",
    slo: "斯洛文尼亚语",
    spa: "西班牙语",
    swe: "瑞典语",
    th: "泰语",
    vie: "越南语",
    wyw: "文言文",
    yue: "粤语",
    zh: "中文"
}

let spinner = ora({
    text: 'Translating...',
    color: 'blue',
}).start();

function trans(words, to='en') {
    return helper.detectlang(words)
        .then(from => {
            if (from === to) {
                // console.log(chalk.blue(words));
                spinner.succeed(chalk.blue(result));
                process.exit(0);
            } else {
                return helper.makeTransOpt(from, to, words);
            }
        })
        .then(transOpt => {
            return helper.translate(transOpt)
        })
        .then(result => {
            // console.log(chalk.blue(result));
            spinner.succeed(chalk.blue(result));
            process.exit(0);
        })
        .catch(err => {
            // console.log(chalk.bold.red(err));
            spinner.fail(chalk.blue(result));
            process.exit(1);
        });
}

program
    .arguments('[words...]')
    .version('0.0.1')
    .option('-t --transto [lang]', 'translate to particular language')
    .action(function (words) {
        let searchWords = words.join(' ');
        spinner.start();
        trans(searchWords, program.transto);
    })
    .parse(process.argv);