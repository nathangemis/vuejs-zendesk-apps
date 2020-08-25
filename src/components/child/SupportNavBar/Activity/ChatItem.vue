<template>
  <q-item
    clickable
    v-ripple
    class="bg-white q-my-xs bordered chat-item"
    @click="$emit('select-chat')"
    :active="active"
    active-class="is-selected bg-grey-3"
  >
    <q-item-section
      avatar
      top
    >
      <q-avatar
        color="primary"
        text-color="white"
      >
        <div v-if="agents.length === 1">
          {{agents[0] | firstLetter}}
        </div>
        <q-icon
          v-else
          name="group"
        />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{agents | names}}</q-item-label>
      <q-item-label
        class="conversation__summary"
        caption
      >Chat id : {{chatId}}</q-item-label>
    </q-item-section>
    <q-item-section
      side
      top
    >{{createdAt}}</q-item-section>
  </q-item>
</template>

<script>
import constant from '@/utils/constant.js'
import { QItem, QItemSection, QItemLabel, QAvatar, QIcon, QSpace } from 'quasar'
export default {
  props: ['chatId', 'agents', 'active', 'createdAt'],
  data () {
    return {
      showItem: false,
      dateFormated: null
    }
  },
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    QAvatar,
    QIcon,
    QSpace
    // QItem: () => import('quasar/src/components/item/QItem.js'),
    // QItemSection: () => import('quasar/src/components/item/QItemSection.js'),
    // QItemLabel: () => import('quasar/src/components/item/QItemLabel.js'),
    // QAvatar: () => import('quasar/src/components/avatar/QAvatar.js'),
    // QIcon: () => import('quasar/src/components/icon/QIcon.js'),
    // QSpace: () => import('quasar/src/components/space/QSpace.js')
  },
  filters: {
    names: function (value) {
      if (!value || !value.length) return ''
      return value.join(',')
    },
    firstLetter: function (value) {
      if (!value || !value.length) return ''
      return value[0]
    }
  },
  created () {
    // this.$request.get(`${constant.API}/messages/?chat=${this.chatId}&is_agent=true`, constant.HEADER, constant.JWT).then(res => {
    //   this.agents = this.distinct(res.results, 'user_id')
    //   this.showItem = true
    //   // this.formatDate()
    // })

  },
  methods: {
    distinct (array, value) {
      let flag = null
      let newArray = array.filter(item => {
        if (item[value] && item[value] !== flag && item[value].length > 0) {
          flag = item[value]
          return item
        }
      })
      return newArray
    },
    // formatDate () {
    //   const date = this.createdAt


    // }
  }
}
</script>

<style>
.chat-item {
  width: 100%;
}
/* .is-selected {
  color: white;
} */
</style>