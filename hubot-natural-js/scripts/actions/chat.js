const { msgVariables, sendMessages, stringElseRandomKey } = require('../lib/common');
const wolkenkit = require('../wolkenkit-client/')

class Chat {
  constructor(interaction) {
    this.process = this.process.bind(this);
    this.interaction = interaction;
    
  }
  process(msg) {
    wolkenkit.connect({ host: 'local.wolkenkit.io', port: 3001 }).
    then(chat => {
        console.log('wolkenkit connected!!!!', msg.message.text)
        
        chat.communication.message().send({ text: msg.message.text }).
          failed(err => console.error(err)).
          delivered(() => {
              console.log('msg delivered')
          });


          
            
        //return sendMessages(stringElseRandomKey(this.interaction.answer), msg);
        return chat.lists.messages.readAndObserve({
            orderBy: { timestamp: 'descending' },
            take: 50
          }).
            failed(err => console.error(err)).
            started(messages => { console.log(messages) }).
            updated(messages => { console.log(messages) });
    })
  }
}

module.exports = Chat;
