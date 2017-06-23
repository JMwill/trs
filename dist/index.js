#!/usr/bin/env node
'use strict';

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var trans = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(words) {
        var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en';
        var lang, transOpt, transResult;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return helper.detectlang(words);

                    case 3:
                        lang = _context.sent;
                        transOpt = helper.makeTransOpt(lang, to, words);
                        _context.next = 7;
                        return helper.translate(transOpt);

                    case 7:
                        transResult = _context.sent;
                        return _context.abrupt('return', transResult);

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);
                        throw new Error('trans function got an error: ' + _context.t0);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 11]]);
    }));

    return function trans(_x) {
        return _ref.apply(this, arguments);
    };
}();

var transSug = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(words) {
        var sugTransResult;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return helper.suggestTrans(words);

                    case 3:
                        sugTransResult = _context2.sent;

                        if (!Array.isArray(sugTransResult)) {
                            sugTransResult = [];
                        }
                        return _context2.abrupt('return', sugTransResult);

                    case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2['catch'](0);
                        throw new Error('transSub function got an error: ' + _context2.t0);

                    case 11:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 8]]);
    }));

    return function transSug(_x3) {
        return _ref2.apply(this, arguments);
    };
}();

var runTrans = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(searchWords) {
        var transTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'zh';
        var transResult, sugTransResult;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        spinner.start();
                        _context3.prev = 1;
                        _context3.next = 4;
                        return trans(searchWords, transTo);

                    case 4:
                        transResult = _context3.sent;
                        _context3.next = 7;
                        return transSug(searchWords);

                    case 7:
                        sugTransResult = _context3.sent;

                        spinner.stop();

                        transResult = '\u7FFB\u8BD1\u7ED3\u679C: ' + transResult + (os.EOL + os.EOL) + '\u5EFA\u8BAE: ' + os.EOL + helper.formatSug(sugTransResult);
                        logUpdate(chalk.blue(helper.doubleBoxen(transResult)));
                        process.exit(0);
                        _context3.next = 19;
                        break;

                    case 14:
                        _context3.prev = 14;
                        _context3.t0 = _context3['catch'](1);

                        spinner.stop();
                        logUpdate(chalk.bold.red(helper.doubleBoxen(_context3.t0)));
                        process.exit(1);

                    case 19:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[1, 14]]);
    }));

    return function runTrans(_x4) {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var program = require('commander');
var chalk = require('chalk');
var logUpdate = require('log-update');
var helper = require('./helper');
var ora = require('ora');
var clipboard = require('clipboardy');
var table = require('table');

var spinner = ora({
    text: 'Translating...',
    color: 'blue'
});

var langMap = {
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
    zh: '中文'
};

program.version('0.0.1').arguments('[words...]').option('-t, --transto <lang>', 'translate to particular language').action(function (words) {
    return runTrans(words.join(' '), program.transto);
});

program.on('--help', function () {
    var data = [['language', '<lang>', 'language', '<lang>']];
    var langMapEntrys = (0, _entries2.default)(langMap);
    var perLineItems = 2;

    var _loop = function _loop(i, l) {
        var tableRow = [];
        langMapEntrys.slice(i * perLineItems, (i + 1) * perLineItems).forEach(function (e) {
            var _ref4 = [e[1], e[0]];
            e[0] = _ref4[0];
            e[1] = _ref4[1];

            tableRow = tableRow.concat(e);
        });
        data.push(tableRow);
    };

    for (var i = 0, l = Math.floor(langMapEntrys.length / perLineItems); i < l; i += 1) {
        _loop(i, l);
    }
    console.log(table.table(data));
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    runTrans(clipboard.readSync());
}