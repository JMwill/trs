const os = require('os');
const request = require('superagent');
const boxen = require('boxen');
const logUpdate = require('log-update');

async function reqTo(url, opt) {
    try {
        let res = await request
            .post(url)
            .set('Content-Type', 'application/json')
            .type('form')
            .send(opt);
        return res;
    } catch (err) {
        throw new Error(`reqTo got an error: ${err}`);
    }
}

async function detectlang(detectword) {
    try {
        let res = await reqTo('http://fanyi.baidu.com/langdetect', { query: detectword });
        return res.body.lan;
    } catch (err) {
        throw new Error(`detectlang function got an error: ${err}`);
    }
}

async function suggestTrans(needSubWords) {
    try {
        let res = await reqTo('http://fanyi.baidu.com/sug', { kw: needSubWords });
        return res.body.data;
    } catch (err) {
        throw new Error(`suggestTrans function got an error: ${err}`);
    }
}

async function translate(reqOpt) {
    try {
        let res = await reqTo('http://fanyi.baidu.com/v2transapi', reqOpt);
        return res.body.trans_result.data[0].dst;
    } catch (err) {
        throw new Error(`translate function got an error: ${err}`);
    }
}

function formatSug(sugs) {
    return sugs.map(s => `${s.k}:${s.v}${os.EOL}`).join('');
}

function makeTransOpt(from, to, words) {
    if (from === to) { from = 'auto'; }
    return {
        from,
        to,
        query: words,
        transtype: 'realtime',
        simple_means_flag: 3,
    };
}

function printBoxLogUpdate(str, padding = 0, margin = 0, borderStyle = 'double') {
    logUpdate(
        boxen(
            str,
            {
                padding,
                margin,
                borderStyle,
            },
        ),
    );
}

module.exports = {
    detectlang,
    translate,
    makeTransOpt,
    printBoxLogUpdate,
    formatSug,
    suggestTrans,
};
