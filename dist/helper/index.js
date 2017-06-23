'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var reqTo = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, opt) {
        var res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return request.post(url).set('Content-Type', 'application/json').type('form').send(opt);

                    case 3:
                        res = _context.sent;
                        return _context.abrupt('return', res);

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);
                        throw new Error('reqTo got an error: ' + _context.t0);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 7]]);
    }));

    return function reqTo(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var detectlang = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(detectword) {
        var res;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return reqTo('http://fanyi.baidu.com/langdetect', { query: detectword });

                    case 3:
                        res = _context2.sent;
                        return _context2.abrupt('return', res.body.lan);

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](0);
                        throw new Error('detectlang function got an error: ' + _context2.t0);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    }));

    return function detectlang(_x3) {
        return _ref2.apply(this, arguments);
    };
}();

var suggestTrans = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(needSubWords) {
        var res;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return reqTo('http://fanyi.baidu.com/sug', { kw: needSubWords });

                    case 3:
                        res = _context3.sent;
                        return _context3.abrupt('return', res.body.data);

                    case 7:
                        _context3.prev = 7;
                        _context3.t0 = _context3['catch'](0);
                        throw new Error('suggestTrans function got an error: ' + _context3.t0);

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[0, 7]]);
    }));

    return function suggestTrans(_x4) {
        return _ref3.apply(this, arguments);
    };
}();

var translate = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(reqOpt) {
        var res;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return reqTo('http://fanyi.baidu.com/v2transapi', reqOpt);

                    case 3:
                        res = _context4.sent;
                        return _context4.abrupt('return', res.body.trans_result.data[0].dst);

                    case 7:
                        _context4.prev = 7;
                        _context4.t0 = _context4['catch'](0);
                        throw new Error('translate function got an error: ' + _context4.t0);

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 7]]);
    }));

    return function translate(_x5) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * @param {Object} sugs
 * @returns String
 */


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var request = require('superagent');
var boxen = require('boxen');

function formatSug(sugs) {
    return sugs.map(function (s) {
        return s.k && s.v ? s.k + ':' + s.v + os.EOL : '';
    }).join('');
}

/**
 * @param {String} from
 * @param {String} to
 * @param {String} words
 * @returns Object
 */
function makeTransOpt(from, to, words) {
    if (from === to) {
        from = 'auto';
    }
    return {
        from: from,
        to: to,
        query: words,
        transtype: 'realtime',
        simple_means_flag: 3
    };
}

/**
 * @param {String} str
 * @returns String
 */
function doubleBoxen(str) {
    return boxen(str, { borderStyle: 'double' });
}

module.exports = {
    detectlang: detectlang,
    translate: translate,
    makeTransOpt: makeTransOpt,
    doubleBoxen: doubleBoxen,
    formatSug: formatSug,
    suggestTrans: suggestTrans
};