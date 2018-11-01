// Include Telegraf module
const Telegraf = require('telegraf');

// Create a bot using TOKEN provided as environment variable
const bot = new Telegraf(process.env.TOKEN);

// Import replies file
const replies = require('./replies')
 
// Extract reply_to_message.message_id field from Telegraf ctx
// If not present, return null
const getReplyToMessageId = ctx => (
    ctx.message.reply_to_message ? ctx.message.reply_to_message.message_id : null
)
 
// This method will send the reply, based on the answer type
// (text / gif / sticker). See replies.js for objects structure.
const sendReply = (ctx, reply) => {
  // reply method will be the Telegraf method for sending the reply
  let replyMethod = {
    text: ctx.reply,
    gif: ctx.replyWithDocument,
    sticker: ctx.replyWithSticker
  }[reply.type]
  
  replyMethod(reply.value, {
    // this will make the bot reply to the original message instead of just sending it
    reply_to_message_id: getReplyToMessageId(ctx) 
  })
}

// /list command - will send all the triggers defined in replies.js.
bot.command('list', ctx => {
    ctx.reply(
        'Available triggers:\n\n' +
        Object.keys(replies).join('\n')
    )
})

// Listen on every text message, if message.text is one of the trigger,
// send the reply
bot.on('text', ctx => {
  let cmd = ctx.message.text.toLowerCase()
  if (cmd in replies)
    sendReply(ctx, replies[cmd])
})

process.on('uncaughtException', function (error) {
	console.log("\x1b[31m", "Exception: ", error, "\x1b[0m");
});

process.on('unhandledRejection', function (error, p) {
	console.log("\x1b[31m","Error: ", error.message, "\x1b[0m");
});

bot.startPolling();