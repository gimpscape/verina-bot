const loki = require('lokijs')

const db = new loki('storage/bot.db', { throttledSaves: false });

let karya

db.loadDatabase({}, function() {
  let col = db.getCollection('karya')
  
  if (col) {
    karya = col
  } else {
    karya = db.addCollection('karya')
  }
  
});

var like = {
  
  handle (ctx) {
    
    //console.log(ctx.callbackQuery)
    
    let data = ctx.callbackQuery.data
    
    let emoji = ['😍','😯','😳','😐']
    
    let chatId = ctx.callbackQuery.message.chat.id
    
    let messageId = ctx.callbackQuery.message.message_id
    
    let fromId = ctx.callbackQuery.from.id
    
    
    
    // Save to DB
    let pesan = karya.findOne({'id':messageId})
    
    if(pesan){
      // Jika karya sudah pernah disimpan
      console.log('Pesan sudah ada ')
      
      let oldLike
      let oldLikeIndex
      
      pesan.likers.forEach((value,index)=>{
        if(value.id == fromId){
          oldLike = pesan.likers[index]
          oldLikeIndex = index
        }
      })
            
      if(oldLike){
        let oldData = oldLike.like
        
        console.log("Sudah pilih: "+oldData)
        
        switch(oldData){
          case '1':
            pesan.likes.love--
            break;
          case '2':
            pesan.likes.wow--
            break
          case '3':
            pesan.likes.hmm--
            break
          case '4':
            pesan.likes.meh--
            break
          default:
            console.log('default')
            break
        }
        
        pesan.likers[oldLikeIndex] = {'id':fromId,'like':data}
                        
        
      }else{
        
        pesan.likers.push({'id':fromId,'like':data})
        
      }
      
      switch(data){
        case '1':
          pesan.likes.love++
          break;
        case '2':
          pesan.likes.wow++
          break
        case '3':
          pesan.likes.hmm++
          break
        case '4':
          pesan.likes.meh++
          break
        default:
          console.log('default')
          break

      }
      
      
      karya.update(pesan)
      db.saveDatabase()
      
      
    }else{
      console.log('Pesan belum ada')
      // Buat karya baru di database
      let likers = []
      
      likers.push({'id':fromId,'like':data})
      
      pesan = karya.insert({
        id : messageId,
        likes : {
          love : data == 1 ? 1 : 0,
          wow  : data == 2 ? 1 : 0,
          hmm  : data == 3 ? 1 : 0,
          meh  : data == 4 ? 1 : 0
        },
        likers: likers
      })
      
      ctx.answerCallbackQuery(`Cie yang pertama ngasih respon ${emoji[data - 1]}`)
      db.saveDatabase()
      
    }
    
    console.log(pesan)
    
    
    ctx.answerCallbackQuery(`Kamu memberi ${emoji[data - 1]} untuk karya ini`)

    
    ctx.telegram.editMessageReplyMarkup(
      chatId,
      messageId,
      null,
      {'inline_keyboard':
          [
            [
              {text: `😍 ${ pesan.likes.love > 0 ? pesan.likes.love : '' }`, callback_data: '1'},
              {text: `😯 ${ pesan.likes.wow > 0 ? pesan.likes.wow : '' }`, callback_data: '2'},
              {text: `😳 ${ pesan.likes.hmm > 0 ? pesan.likes.hmm : '' }`, callback_data: '3'},
              {text: `😐 ${ pesan.likes.meh > 0 ? pesan.likes.meh : ''}`, callback_data: '4'}
            ]
          ]
      }
    )
    
  }
  
}

module.exports = like