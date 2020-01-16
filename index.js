require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('robot start')
})

bot.on('message', event => {
  console.log(event.message)
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    rp('https://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000352-001')
      .then(htmlString => {
        let json = JSON.parse(htmlString)
        console.log(json)
        json = json.result.records.filter(j => {
          if (j.sna === usermsg) return true
          else return false
        })
        console.log(json)
        if (json.length > 0) event.reply('可借車數量' + json[0].sbi)
        else event.reply('沒有資料')
      })
      .catch(() => {
        event.reply('error')
      })
}
})
