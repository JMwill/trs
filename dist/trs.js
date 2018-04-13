'use strict';

let reqTo = (() => {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, opt) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return request.post(url).type('form').send(opt);

        case 3:
          res = _context.sent;
          return _context.abrupt('return', res);

        case 7:
          _context.prev = 7;
          _context.t0 = _context['catch'](0);
          throw new Error(config.errTmpl('reqTo', _context.t0));

        case 10:
        case 'end':
          return _context.stop();
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function reqTo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let detectlang = (() => {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(word) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return reqTo(`${config.URLs[config.env]}/langdetect`, { query: word });

        case 3:
          res = _context2.sent;
          return _context2.abrupt('return', res.body.lan);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2['catch'](0);
          throw new Error(config.errTmpl('detectlang', _context2.t0));

        case 10:
        case 'end':
          return _context2.stop();
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function detectlang(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

let getTokenEtc = (() => {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var tokenReg, gtkReg, res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          tokenReg = /token:\s?'([^']*)'/g;
          gtkReg = /gtk\s?=\s?'([^']*)'/g;
          _context3.next = 4;
          return request.get(config.URLs[config.env]).set('Cache-Control', 'no-cache').set('Pragma', 'no-cache').set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36').then(function ({ text }) {
            const token = tokenReg.exec(text);
            const gtk = gtkReg.exec(text);
            return token && token[1] ? { token: token[1], gtk: gtk && gtk[1] || '' } : {};
          });

        case 4:
          res = _context3.sent;
          return _context3.abrupt('return', res);

        case 6:
        case 'end':
          return _context3.stop();
      }
    }, _callee3, this);
  }));

  return function getTokenEtc() {
    return _ref3.apply(this, arguments);
  };
})();

let getSuggestion = (() => {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(word) {
    var res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return reqTo(`${config.URLs[config.env]}/sug`, { kw: word });

        case 3:
          res = _context4.sent;
          return _context4.abrupt('return', res.body.data || []);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4['catch'](0);
          throw new Error(config.errTmpl('getSuggestion', _context4.t0));

        case 10:
        case 'end':
          return _context4.stop();
      }
    }, _callee4, this, [[0, 7]]);
  }));

  return function getSuggestion(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

let getTranslate = (() => {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(postData) {
    var res;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return reqTo(`${config.URLs[config.env]}/v2transapi`, postData);

        case 3:
          res = _context5.sent;
          return _context5.abrupt('return', res.body.trans_result || {});

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5['catch'](0);
          throw new Error(config.errTmpl('getTranslate', _context5.t0));

        case 10:
        case 'end':
          return _context5.stop();
      }
    }, _callee5, this, [[0, 7]]);
  }));

  return function getTranslate(_x5) {
    return _ref5.apply(this, arguments);
  };
})();

/**
 * @param {String} from
 * @param {String} to
 * @param {String} words
 * @returns Object
 */


let translate = (() => {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(words, to = config.defaultTransTo) {
    var lang, tokenEtc, transOpt, result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return detectlang(words);

        case 3:
          lang = _context6.sent;
          _context6.next = 6;
          return getTokenEtc();

        case 6:
          tokenEtc = _context6.sent;
          transOpt = makeTransOpt(lang, to, words, tokenEtc);
          _context6.next = 10;
          return getTranslate(transOpt);

        case 10:
          result = _context6.sent;
          return _context6.abrupt('return', result);

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6['catch'](0);
          throw new Error(config.errTmpl('translate', _context6.t0));

        case 17:
        case 'end':
          return _context6.stop();
      }
    }, _callee6, this, [[0, 14]]);
  }));

  return function translate(_x6) {
    return _ref6.apply(this, arguments);
  };
})();

let runTrs = (() => {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(searchWords, transTo = 'zh') {
    var transResult, suggestion, data;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          spinner.start();
          _context7.prev = 1;
          _context7.next = 4;
          return translate(searchWords, transTo);

        case 4:
          transResult = _context7.sent;
          _context7.next = 7;
          return getSuggestion(searchWords);

        case 7:
          suggestion = _context7.sent;
          data = generateTmplData(suggestion, transResult);

          spinner.stop();

          logUpdate(chalk.blue(config.resultTmpl(data)));
          process.exit(0);
          _context7.next = 19;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7['catch'](1);

          spinner.stop();
          logUpdate(chalk.bold.red(doubleBoxen(_context7.t0)));
          process.exit(1);

        case 19:
        case 'end':
          return _context7.stop();
      }
    }, _callee7, this, [[1, 14]]);
  }));

  return function runTrs(_x7) {
    return _ref7.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const request = require('superagent').agent();
const boxen = require('boxen');
const config = require('./config');
const bdMd5 = require('./md5');
// const stringWidth = require('string-width')

const spinner = ora(config.spinner);

// function splitStrWithColumnWidth(str, width, padding = 20) {
//   let index = 0
//   let result = []
//   let substr
//   let realWidth
//   let newIndex
//   while (str[index]) {
//     substr = str.substr(index, width)
//     realWidth = stringWidth(substr)
//     newIndex = Math.floor((width - padding) * (substr.length / realWidth)) + index
//     newIndex = newIndex > index ? newIndex : index + 1

//     result.push(str.slice(index, newIndex))
//     index = newIndex
//   }
//   return result
// }

function generateTmplData(suggestion, transResult) {
  let data = transResult.data && transResult.data[0] || [];
  let src = data.src || '';
  let dst = data.dst || '';
  // let terminalWidth = process.stdout.columns

  return {
    source: src,
    result: dst,
    suggestion,
    details: {
      百度: `http://fanyi.baidu.com/#${transResult.from}/${transResult.to}/${encodeURIComponent(data.src)}`,
      谷歌: `https://translate.google.com/#auto/${transResult.to}/${encodeURIComponent(data.src)}`
    }
  };
}

function makeTransOpt(from, to, words, tokenEtc) {
  if (from === to) {
    from = 'auto';
  }
  return {
    from,
    to,
    query: words,
    simple_means_flag: 3,
    sign: bdMd5(words, tokenEtc.gtk || ''),
    token: tokenEtc.token || ''
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
  detectlang,
  getTranslate,
  makeTransOpt,
  doubleBoxen,
  getSuggestion,
  runTrs,
  translate,
  getTokenEtc
};