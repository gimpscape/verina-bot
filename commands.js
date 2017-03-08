
var admins = [
  17648054,    // Chip
  244042170,   // Rania
  62781319,    // Andreecy
  126723061,   // Sofyan 
  14455205,     // Herbanu
  120789542     //akmal
]

var commands = {

    handleMessage(ctx) {
      
        if (ctx.updateType == 'message') {

            let subType = ctx.updateSubType

            switch (ctx.updateSubType) {

                case 'text':
                    this.handleTextMessage(ctx)
                    break

                case 'new_chat_member':
                    this.handleGreetings(ctx)
                    break

                case 'left_chat_member':
                    console.log(ctx)
                    break

            }

        } else if (ctx.updateType == 'inline_query') {

            console.log('Inline query :D')
            console.log(ctx)

        }

    },

    handleTextMessage(ctx) {

        console.log(`${ctx.message.chat.title} (${ctx.message.chat.id}) : @ ${ctx.from.first_name} => ${ctx.message.text}`)

        if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {

            this.handleGroupText(ctx)

        } else if (ctx.chat.type == "private") {

            this.handlePrivate(ctx)

        }

    },

    handleGreetings(ctx) {

        let member = ctx.message.new_chat_member
        let group = ctx.chat

        let greetings = `Halo <b>${member.first_name}</b>!\n\nSelamat datang  di Group <b>${group.title}</b>`

        ctx.replyWithHTML(greetings)

    },

    handleGroupText(ctx) {
        //console.log(ctx.update)

        let message = ctx.message.text

        switch (message) {
            case "!rules":

                ctx.replyWithHTML(
                  '<b>Peraturan</b>\n\nBaca: Belum dibikin gaes!',
                  {'reply_to_message_id':ctx.message.message_id}
                )
            
                break;

            case "!ping":
            
                ctx.replyWithMarkdown('*Pong!!!*',{'reply_to_message_id':ctx.message.message_id})
            
                break
                
            case "!source":
                ctx.replyWithHTML('Masih dibikin gaes')
                break;

            case "!members":

                ctx.getChatMembersCount()
                    .then((data) => {
                        ctx.replyWithMarkdown(`*Jumlah Anggota*: ${data}`,{'reply_to_message_id':ctx.message.message_id})
                    })

                break
                
            case "!ss":
                
                if(ctx.message.reply_to_message != null){
                  
                  let idToReply = ctx.message.reply_to_message.message_id
                  ctx.replyWithMarkdown('Kirimkan _Screenshot_ biar lebih jelas gan!',{'reply_to_message_id':idToReply})
                  
                }
            
                break
          
            case "!report":
                
                if(ctx.message.reply_to_message != null){
                  
                  let idToReply = ctx.message.reply_to_message.message_id
                  ctx.replyWithMarkdown('*Siap!* \nTerimakasih laporanya 👮 ',{'reply_to_message_id':idToReply})
                  ctx.telegram.sendMessage(
                    '-1001097847357', // Admin Gimpscape
                    `👮 <b>Laporan Post !</b>\n\nReport by: <b>${ctx.message.from.first_name}</b>\nMessage : <a href="https://t.me/${ctx.chat.username}/${idToReply}">Reported Message</a>`,
                    {'parse_mode':'HTML'}
                  )
                  
                }
            
                break
            
            case "!repost":
                
                let isAdmin = false
                                
                if(admins.indexOf(ctx.message.from.id) >= 0){
                  
                  isAdmin = true
                  
                }else{
                  
                  ctx.reply('Kamu siapah? 😒',{'reply_to_message_id':ctx.message.message_id})
                  return
                  
                }
                
                if(ctx.message.reply_to_message != null){
                  
                  //console.log(ctx.message)
                  
                  let message = ctx.message.reply_to_message.text
                  let image = ctx.message.reply_to_message.photo
                  let document = ctx.message.reply_to_message.document
                  
                  if(message != null){
                    //ctx.telegram.sendMessage('@chanel_purapura',message)  
                    ctx.reply('Maunya repost foto doank 😋',{'reply_to_message_id':ctx.message.message_id})
                  }else if(image != null){
                    
                    let caption = ctx.message.reply_to_message.caption
                    
                    ctx.telegram.sendPhoto(
                      '@gimpscape_ruang_karya',
                      ctx.message.reply_to_message.photo[2].file_id, 
                      {
                        'caption':caption,
                        'reply_markup': 
                           {'inline_keyboard':
                            [
                              [{text: '😍', callback_data: '1'},{text: '😮', callback_data: '2'},{text: '😳', callback_data: '3'},{text: '😐', callback_data: '4'}]
                            ]
                           }
                      }
                    )
                    
                  }else if(document != null){
                    
                    let caption = ctx.message.reply_to_message.caption
                    
                    ctx.telegram.sendDocument(
                      '@gimpscape_ruang_karya',
                      document.file_id, 
                      {
                        'caption':caption,
                        'reply_markup': 
                           {'inline_keyboard':
                            [
                              [{text: '😍', callback_data: '1'},{text: '😮', callback_data: '2'},{text: '😳', callback_data: '3'},{text: '😐', callback_data: '4'}]
                            ]
                           }
                      }
                    )
                  }
                  
                }
            
                
                break
            case "!key":
            
                ctx.reply(
                  'Check',
                  {'reply_markup': 
                     {'inline_keyboard':
                      [
                        [{text: '😍', callback_data: '1'},{text: '😯', callback_data: '2'},{text: '😳', callback_data: '3'},{text: '😐', callback_data: '4'}]
                      ]
                     }
                  })
            
                break
                
            case "!id":
            
              ctx.replyWithMarkdown(`*👮 Permintaan Info ID! 👮* \nID: ${ctx.message.from.id} \nNama: ${ctx.message.from.first_name} `,{'reply_to_message_id':ctx.message.message_id})
              break
              
            default:
                break

        }

    },

    handlePrivate(ctx) {
        ctx.replyWithHTML('Maaf, lagi sibuk ngurusin group 😚')
    }

}



module.exports = commands