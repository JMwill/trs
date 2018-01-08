#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const logUpdate = require('log-update')
const ora = require('ora')
const clipboard = require('clipboardy')
const table = require('table')
const request = require('superagent').agent()
const boxen = require('boxen')
const config = require('./config')
const bdMd5 = require('./md5')
const pkg = require('../package.json')
// const stringWidth = require('string-width')

const spinner = ora(config.spinner)

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
  let data = (transResult.data && transResult.data[0]) || []
  let src = data.src || ''
  let dst = data.dst || ''
  // let terminalWidth = process.stdout.columns

  return {
    source: src,
    result: dst,
    suggestion,
    details: {
      百度: `http://fanyi.baidu.com/#${transResult.from}/${transResult.to}/${encodeURIComponent(data.src)}`,
      谷歌: `https://translate.google.com/#auto/${transResult.to}/${encodeURIComponent(data.src)}`,
    },
  }
}


async function reqTo(url, opt) {
  try {
    let res = await request
      .post(url)
      .type('form')
      .send(opt)
    return res
  } catch (err) {
    throw new Error(config.errTmpl('reqTo', err))
  }
}

async function detectlang(word) {
  try {
    let res = await reqTo(`${config.URLs[config.env]}/langdetect`, { query: word })
    return res.body.lan
  } catch (err) {
    throw new Error(config.errTmpl('detectlang', err))
  }
}

async function getTokenEtc() {
  const tokenReg = /token:\s?'([^']*)'/g
  const gtkReg = /gtk\s?=\s?'([^']*)'/g
  let res = await request
    .get(config.URLs[config.env])
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache')
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36')
    .then(({ text }) => {
      const token = tokenReg.exec(text)
      const gtk = gtkReg.exec(text)
      return (token && token[1])
        ? { token: token[1], gtk: (gtk && gtk[1]) || '' }
        : {}
    })
  return res
}

async function getSuggestion(word) {
  try {
    let res = await reqTo(`${config.URLs[config.env]}/sug`, { kw: word })
    return res.body.data || []
  } catch (err) {
    throw new Error(config.errTmpl('getSuggestion', err))
  }
}

async function getTranslate(postData) {
  try {
    let res = await reqTo(`${config.URLs[config.env]}/v2transapi`, postData)
    return res.body.trans_result || {}
  } catch (err) {
    throw new Error(config.errTmpl('getTranslate', err))
  }
}

/**
 * @param {String} from
 * @param {String} to
 * @param {String} words
 * @returns Object
 */
function makeTransOpt(from, to, words, tokenEtc) {
  if (from === to) { from = 'auto' }
  return {
    from,
    to,
    query: words,
    simple_means_flag: 3,
    sign: bdMd5(words, tokenEtc.gtk || ''),
    token: tokenEtc.token || '',
  }
}

/**
 * @param {String} str
 * @returns String
 */
function doubleBoxen(str) {
  return boxen(str, { borderStyle: 'double' })
}

async function translate(words, to = config.defaultTransTo) {
  try {
    let lang = await detectlang(words)
    let tokenEtc = await getTokenEtc()
    let transOpt = makeTransOpt(lang, to, words, tokenEtc)
    let result = await getTranslate(transOpt)
    return result
  } catch (err) {
    throw new Error(config.errTmpl('translate', err))
  }
}

async function runTrs(searchWords, transTo = 'zh') {
  spinner.start()
  try {
    let transResult = await translate(searchWords, transTo)
    let suggestion = await getSuggestion(searchWords)
    let data = generateTmplData(suggestion, transResult)
    spinner.stop()

    logUpdate(chalk.blue(config.resultTmpl(data)))
    process.exit(0)
  } catch (err) {
    spinner.stop()
    logUpdate(chalk.bold.red(doubleBoxen(err)))
    process.exit(1)
  }
}

function main() {
  program
    .version(pkg.version)
    .arguments('[words...]')
    .option('-t, --transto <lang>', 'translate to particular language')
    .action(words => runTrs(words.join(' '), program.transto))

  program.on('--help', () => {
    let data = [
      ['language', '<lang>', 'language', '<lang>'],
    ]
    let langMapEntrys = Object.entries(config.langMap)
    let perLineItems = 2
    for (let i = 0, l = Math.floor(langMapEntrys.length / perLineItems); i < l; i += 1) {
      let tableRow = []
      langMapEntrys.slice(i * perLineItems, (i + 1) * perLineItems)
        .forEach((e) => {
          [e[0], e[1]] = [e[1], e[0]]
          tableRow = tableRow.concat(e)
        })
      data.push(tableRow)
    }
    console.log(table.table(data))
  })

  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    runTrs(clipboard.readSync())
  }
}

if (require.main === module) {
  main()
} else {
// export for test
  module.exports = {
    detectlang,
    getTranslate,
    makeTransOpt,
    doubleBoxen,
    getSuggestion,
    runTrs,
    translate,
    getTokenEtc,
  }
}
