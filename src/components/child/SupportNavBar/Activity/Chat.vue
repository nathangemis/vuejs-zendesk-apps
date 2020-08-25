<template>
  <div class="q-px-md full-width">
    <q-chat-message
      style="max-width:60%;"
      v-for="(item,index) in messages"
      :key="index + '-message'"
      :name="item[0].user_name   "
      :text="item.map(i => `<div class=message-${i.id}>${i.content}</div>`)"
      :bg-color="item[0].is_agent ? 'primary' : 'grey-4'"
      :text-color="item[0].is_agent ? 'white' : 'black'"
    >

      <template v-slot:avatar>

        <q-avatar
          class="q-mr-sm"
          color="primary"
          text-color="white"
          size="md"
        >
          <div>{{item[0].user_name[0]}}</div>
        </q-avatar>

      </template>

    </q-chat-message>
  </div>
</template>

<script>
import constant from '@/utils/constant.js'
import { QChatMessage, QAvatar } from 'quasar'
export default {
  name: 'chat',
  props: ['messages'],
  data () {
    return {
      msgArr: []
    }
  },
  components: {
    QChatMessage,
    QAvatar
    // QChatMessage: () => import('quasar/src/components/chat/QChatMessage.js'),
    // QAvatar: () => import('quasar/src/components/avatar/QAvatar.js'),
  }
}
</script>

<style>
</style>