const request = require('superagent');

module.exports = {
    detectlang,
    translate,
    makeTransOpt
};
function detectlang(detectword) {
    return new Promise((resolve, reject) => {
        request
            .post('http://fanyi.baidu.com/langdetect')
            .set('Content-Type', 'application/json')
            .type('form')
            .send({query: detectword})
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

function translate(reqOpt) {
    return new Promise((resolve, reject) => {
        request
            .post('http://fanyi.baidu.com/v2transapi')
            .set('Content-Type', 'application/json')
            .type('form')
            .send(reqOpt)
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

function makeTransOpt(from, to, words) {
    return {
        from: from,
        to: to,
        query: words,
        transtype: "realtime",
        simple_means_flag: 3,
    };
}