const helper = require('./index')

test('detectlang function that detect what language are words belong to', async () => {
  await expect(helper.detectlang('你好')).resolves.toEqual('zh')
  await expect(helper.detectlang('hello')).resolves.toEqual('en')
})

test('translate function that translate words to what you expected', async () => {
  await expect(helper.translate('hello')).resolves.toHaveProperty(['data', '0', 'dst'], '你好')
})
