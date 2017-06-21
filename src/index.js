#!/usr/bin/env node

const os = require('os');
const program = require('commander');
const chalk = require('chalk');
const logUpdate = require('log-update');
const helper = require('./helper');
const ora = require('ora');
const clipboard = require('clipboardy');
const table = require('table');

const spinner = ora({
    text: 'Translating...',
    color: 'blue',
});

let langMap = {
    ara: '阿拉伯语',
    auto: '自动检测',
    bul: '保加利亚语',
    cht: '繁体中文',
    cs: '捷克语',
    dan: '丹麦语',
    de: '德语',
    el: '希腊语',
    en: '英语',
    est: '爱沙尼亚语',
    fin: '芬兰语',
    fra: '法语',
    hu: '匈牙利语',
    it: '意大利语',
    jp: '日语',
    kor: '韩语',
    nl: '荷兰语',
    pl: '波兰语',
    pt: '葡萄牙语',
    rom: '罗马尼亚语',
    ru: '俄语',
    slo: '斯洛文尼亚语',
    spa: '西班牙语',
    swe: '瑞典语',
    th: '泰语',
    vie: '越南语',
    wyw: '文言文',
    yue: '粤语',
    zh: '中文',
};


async function trans(words, to = 'en') {
    try {
        let lang = await helper.detectlang(words);
        let transOpt = helper.makeTransOpt(lang, to, words);
        let transResult = await helper.translate(transOpt);
        return transResult;
    } catch (err) {
        throw new Error(`trans function got an error: ${err}`);
    }
}

async function transSug(words) {
    try {
        let sugTransResult = await helper.suggestTrans(words);
        if (!Array.isArray(sugTransResult)) { sugTransResult = []; }
        return sugTransResult;
    } catch (err) {
        throw new Error(`transSub function got an error: ${err}`);
    }
}

async function runTrans(searchWords, transTo = 'zh') {
    spinner.start();
    try {
        let transResult = await trans(searchWords, transTo);
        let sugTransResult = await transSug(searchWords);
        spinner.stop();

        transResult = `翻译结果: ${transResult}${os.EOL + os.EOL}建议: ${os.EOL}${helper.formatSug(sugTransResult)}`;
        logUpdate(chalk.blue(helper.doubleBoxen(transResult)));
        process.exit(0);
    } catch (err) {
        spinner.stop();
        logUpdate(chalk.bold.red(helper.doubleBoxen(err)));
        process.exit(1);
    }
}

program
    .version('0.0.1')
    .arguments('[words...]')
    .option('-t, --transto <lang>', 'translate to particular language')
    .action(words => runTrans(words.join(' '), program.transto));

program.on('--help', () => {
    let data = [
        ['language', '<lang>', 'language', '<lang>'],
    ];
    let langMapEntrys = Object.entries(langMap);
    let perLineItems = 2;
    for (let i = 0, l = Math.floor(langMapEntrys.length / perLineItems); i < l; i += 1) {
        let tableRow = [];
        langMapEntrys.slice(i * perLineItems, (i + 1) * perLineItems)
            .forEach((e) => {
                [e[0], e[1]] = [e[1], e[0]];
                tableRow = tableRow.concat(e);
            });
        data.push(tableRow);
    }
    console.log(table.table(data));
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    runTrans(clipboard.readSync());
}

