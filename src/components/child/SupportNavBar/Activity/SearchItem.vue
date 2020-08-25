<template>
  <q-item
    clickable
    v-ripple
    class="bg-white q-my-xs bordered chat-item"
    @click="$emit('go-to-text')"
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
        <div>
          {{name[0]}}
        </div>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{name}}</q-item-label>
      <q-item-label
        class="conversation__summary"
        lines="1"
        caption
      >{{content}}</q-item-label>
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
  props: ['name', 'active', 'content', 'createdAt'],
  data () {
    return {
      agents: [],
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
}
</script>