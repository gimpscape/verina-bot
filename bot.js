const Telegraf = require('telegraf')
const commands = require('./commands')
const like     = require('./like')

const bot = new Telegraf(process.env.TOKEN)

bot.telegram.setWebhook('https://gimpscape-bot.gomix.me/webhook')

const photoMiddleware = (ctx, next) => {
  return bot.telegram.getFileLink(ctx.message.photo[0])
    .then((link) => {
      ctx.state.fileLink = link
      return next()
    })
}



// Handle Message
bot.on('message', (ctx) => {
  
  commands.handleMessage(ctx)
  
})

bot.on('callback_query', (ctx) => {
  
  like.handle(ctx)
  
})

bot.catch((err) => {
  console.log('Ooops', err)
})

module.exports = bot