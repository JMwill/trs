#!/usr/bin/env node
require('babel-polyfill')
const trs = require('./trs')
const program = require('commander')
const clipboard = require('clipboardy')
const table = require('table')
const pkg = require('../package.json')
const config = require('./config')

function main() {
  program
    .version(pkg.version)
    .arguments('[words...]')
    .option('-t, --transto <lang>', 'translate to particular language')
    .action(words => trs.runTrs(words.join(' '), program.transto))

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
    trs.runTrs(clipboard.readSync())
  }
}

if (require.main === module) {
  main()
}
