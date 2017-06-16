#!/usr/bin/env node

const fs            = require('fs');
const co            = require('co');
const prompt        = require('co-prompt');
const request       = require('superagent');
const program       = require('commander');
const chalk         = require('chalk');
const ProgressBar   = require('progress');

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
                    if (res.body.msg === 'success') {
                        resolve(res.body.lan)
                    }
                    return res.body.lan;
                } catch(err) {
                    reject(err);
                }
            });
    });
}