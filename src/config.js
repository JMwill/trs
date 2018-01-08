const os = require('os')

const resultTmpl = data =>
  `
翻译结果：
源：${data.source}

译：${data.result}


建议：
  ${(data.suggestion || [])
    .map(s => ((s.k && s.v) ? `${s.k}: ${s.v}${os.EOL}  ` : ''))
    .join('')}

详情：
  ${Object.keys(data.details)
    .map(k => `${k}翻译详情：${data.details[k]}`)
    .join(`${os.EOL}  `)}
`

module.exports = {
  langMap: {
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
    zh: '中文',
  },
  spinner: {
    text: 'Translating...',
    color: 'blue',
  },
  defaultTransTo: 'en',
  env: 'production', // production, local
  URLs: {
    local: 'http://localhost:3000',
    production: 'http://fanyi.baidu.com',
  },
  errTmpl: (func, err) => `Run ${func} function got an error:\n${err}`,
  resultTmpl,
}
