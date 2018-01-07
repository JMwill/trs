const os = require('os')
const helper = require('./index')

test('make transalate option', () => {
  expect(helper.makeTransOpt('en', 'zh', 'hello'))
    .toEqual({ from: 'en', to: 'zh', query: 'hello', transtype: 'realtime', simple_means_flag: 3 })
  expect(helper.makeTransOpt('en', 'en', 'haha'))
    .toEqual({ from: 'auto', to: 'en', query: 'haha', transtype: 'realtime', simple_means_flag: 3 })
})

test('detectlang function that detect what language are words belong to', async () => {
  await expect(helper.detectlang('你好')).resolves.toEqual('zh')
  await expect(helper.detectlang('hello')).resolves.toEqual('en')
})

test('suggestTrans function that get words suggestion', async () => {
  await expect(helper.suggestTrans('你好')).resolves.toBeInstanceOf(Array)
})

test('translate function that translate words to what you expected', async () => {
  let transOpt = helper.makeTransOpt('en', 'zh', 'hello')
  await expect(helper.translate(transOpt)).resolves.toBe('你好')
})

test('formatSug function that format suggestion object to another form', async () => {
  expect(helper.formatSug([{
    k: '你好',
    v: 'hello',
  }])).toBe(`你好:hello${os.EOL}`)
  expect(helper.formatSug([{
    k: '你好',
  }])).toBe('')
})
