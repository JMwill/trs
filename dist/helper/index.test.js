'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var helper = require('./index');

test('make transalate option', function () {
    expect(helper.makeTransOpt('en', 'zh', 'hello')).toEqual({ from: 'en', to: 'zh', query: 'hello', transtype: 'realtime', simple_means_flag: 3 });
    expect(helper.makeTransOpt('en', 'en', 'haha')).toEqual({ from: 'auto', to: 'en', query: 'haha', transtype: 'realtime', simple_means_flag: 3 });
});

test('detectlang function that detect what language are words belong to', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return expect(helper.detectlang('你好')).resolves.toEqual('zh');

                case 2:
                    _context.next = 4;
                    return expect(helper.detectlang('hello')).resolves.toEqual('en');

                case 4:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, undefined);
})));

test('suggestTrans function that get words suggestion', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return expect(helper.suggestTrans('你好')).resolves.toBeInstanceOf(Array);

                case 2:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, undefined);
})));

test('translate function that translate words to what you expected', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var transOpt;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    transOpt = helper.makeTransOpt('en', 'zh', 'hello');
                    _context3.next = 3;
                    return expect(helper.translate(transOpt)).resolves.toBe('你好');

                case 3:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee3, undefined);
})));

test('formatSug function that format suggestion object to another form', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    expect(helper.formatSug([{
                        k: '你好',
                        v: 'hello'
                    }])).toBe('\u4F60\u597D:hello' + os.EOL);
                    expect(helper.formatSug([{
                        k: '你好'
                    }])).toBe('');

                case 2:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _callee4, undefined);
})));