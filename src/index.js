#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const logUpdate = require('log-update')
const ora = require('ora')
const clipboard = require('clipboardy')
const table = require('table')
const request = require('superagent')
const boxen = require('boxen')
const config = require('./config')

const spinner = ora(config.spinner)

async function reqTo(url, opt) {
  try {
    let res = await request
      .post(url)
      .set('Content-Type', 'application/json')
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
function makeTransOpt(from, to, words) {
  if (from === to) { from = 'auto' }
  return {
    from,
    to,
    query: words,
    transtype: 'realtime',
    simple_means_flag: 3,
  }
}

function generateTmplData(suggestion, transResult) {
  let data = transResult.data || []
  return {
    source: data.src || '',
    result: data.dst || '',
    suggestion,
    details: {
      百度: `http://fanyi.baidu.com/#${data.from}/${data.to}/${data.src}`,
      谷歌: `https://translate.google.com/#${data.to}/${data.to}/${data.src}`,
    },
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
    let transOpt = makeTransOpt(lang, to, words)
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

    logUpdate(chalk.blue(doubleBoxen(config.resultTmpl(data))))
    process.exit(0)
  } catch (err) {
    spinner.stop()
    logUpdate(chalk.bold.red(doubleBoxen(err)))
    process.exit(1)
  }
}

function main() {
  program
    .version('0.0.1')
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
  }
}
