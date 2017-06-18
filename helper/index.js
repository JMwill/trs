const os            = require('os');
const request       = require('superagent');
const boxen         = require('boxen');
const logUpdate     = require('log-update');

module.exports = {
    detectlang,
    translate,
    makeTransOpt,
    printBoxLogUpdate,
    formatSug,
    suggestTrans,
};

function _reqTo(url, opt) {
    return request
            .post(url)
            .set('Content-Type', 'application/json')
            .type('form')
            .send(opt);
}

function detectlang(detectword) {
    return new Promise((resolve, reject) => {
        _reqTo('http://fanyi.baidu.com/langdetect', {query: detectword})
            .end((err, res) => {
                if (err) { return reject(err); }
                try {
                    resolve(res.body.lan)
                } catch(err) {
                    reject(err);
                }
            });
    });
}

function suggestTrans(needSubWords) {
    return new Promise((resolve, reject) => {
        _reqTo('http://fanyi.baidu.com/sug', {kw: needSubWords})
            .end((err, res) => {
                if (err) { return reject(err); }
                try {
                    resolve(res.body.data)
                } catch(err) {
                    reject(err);
                }
            });
    })
}

function translate(reqOpt) {
    return new Promise((resolve, reject) => {
        _reqTo('http://fanyi.baidu.com/v2transapi', reqOpt)
            .end((err, res) => {
                if (err) { return reject(err); }
                try {
                    resolve(res.body.trans_result.data[0].dst);
                } catch(err) {
                    reject(err);
                }
            });
    });
}

function formatSug(sugs) {
    return sugs.map(s => {
        return `${s.k}:${s.v}${os.EOL}`
    }).join('');
}

function makeTransOpt(from, to, words) {
    if (from === to) { from = 'auto'; }
    return {
        from: from,
        to: to,
        query: words,
        transtype: "realtime",
        simple_means_flag: 3,
    };
}

function printBoxLogUpdate(str, padding=0, margin=0, borderStyle='double') {
    logUpdate(
        boxen(
            str,
            {padding: padding, margin: margin, borderStyle: borderStyle}
        )
    );
}