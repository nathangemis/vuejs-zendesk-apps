<template>
  <div></div>
</template>
<script>
import request from '@/utils/request.js'
import constant from '@/utils/constant.js'
import { date } from 'quasar'
// const date = import(/* webpackPreload: true */'quasar/src/utils/date.js')
export default {
  name: 'chat-side-bar',
  data () {
    return {
      chatId: null,
      msgData: null
    }
  },
  mounted () {
    this.$client.on('channel.chat.start', evt => {
      console.log('chat start event', evt);
      if (this.chatId) {
        this.chatStart().then(res => {
          console.log('chat started', res);
        })
      }
    })

    this.$client.on('channel.chat.end', evt => {
      this.chatEnd().then(res => {
        console.log('Chat ended', res);
      })
    })
    this.getVisitor().then(res => {
      console.log('Get visitor Info', res);
    })
    this.getChat().then(res => {
      console.log('Get Chat Info', res);
      this.chatId = res.chat.id
      const chatId = {
        chat_id: res.chat.id
      }

      if (res.chat.id) {
        this.createChat(chatId).then(res => {
          console.log('chat created', res);
        })
      }
    })
    this.$client.on('channel.message.sent', evt => {
      console.log('msg sent', evt);
      this.postMsg(evt).then(res => {
        if (res) {
          console.log('Message created', res);
        }
      })
    })
    this.$client.on('channel.message.received', evt => {
      console.log('msg receive', evt);
      this.postMsg(evt).then(res => {
        if (res) {
          console.log('Message created', res);
        }
      })
    })
  },
  methods: {
    chatStart () {
      const data = { chat_end: false }
      return request.patch(`${constant.API}/chats/${this.chatId}`, data, constant.HEADER, constant.JWT)

    },
    getAgents () {
      return this.$client.get('agents')
    },
    getChat () {
      return this.$client.get('chat')
    },
    getVisitor () {
      return this.$client.get('visitor')
    },
    postMsg (msg) {
      // createMsgData(msg)
      const chat = this.chatId
      const userId = msg.nick.includes('agent:') ? msg.nick.split('agent:')[1] : msg.nick
      const userName = msg.display_name
      const content = msg.message
      const ts = date.formatDate(msg.ts, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      const isAgent = msg.nick.includes('agent:') ? true : false

      const data = {
        chat,
        user_id: userId,
        user_name: userName,
        content,
        ts,
        is_agent: isAgent
      }
      if (!chat) {
        console.log('creating chat before post');
        return this.getChat().then(res => {
          this.chatId = res.chat.id
          const chatId = {
            chat_id: res.chat.id
          }
          this.createChat(chatId).then(res => {
            console.log('Chat created before post msg', res);
          }).then(() => {
            return this.postMsg(msg).then(res => {
              console.log('post message after creating chat', res);
            })
          })
        })
      }
      return request.post(`${constant.API}/messages/`, data, constant.HEADER, constant.JWT)
    },
    chatEnd () {
      const data = { chat_end: true }
      return request.patch(`${constant.API}/chats/${this.chatId}`, data, constant.HEADER, constant.JWT)
    },
    createChat (chatId) {
      return request.post(`${constant.API}/chats/`, chatId, constant.HEADER, constant.JWT)
    },
    createMsgData (msg) {
      import('quasar/src/utils/date.js').then(mod => {



      })
    }
  }
};
</script>
<style>
</style>