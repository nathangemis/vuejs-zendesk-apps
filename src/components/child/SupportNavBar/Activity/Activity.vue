<template>
  <q-layout
    view="lHr LpR fFf"
    container
  >

    <q-header bordered>
      <q-toolbar class="bg-white text-black">
        <q-avatar
          color="primary"
          text-color="white"
        >
          <div v-if="currChatAgents.length === 1">
            {{currChatAgents[0].user_name[0]}}
          </div>
          <q-icon
            v-else
            name="group"
          />
        </q-avatar>

        <span
          v-if="currChatAgents.length === 1"
          class="q-subtitle-1 q-pl-md"
        >
          {{currChatAgents[0].user_name}}
        </span>
        <span
          v-else
          class="q-subtitle-1 q-pl-md"
        >
          {{viewChatAgents()}}
        </span>

        <q-space />
        <q-btn
          round
          unelevated
          :color="searchMsg ? 'grey-3' : 'white'"
          text-color="black"
          @click="searchInMsg"
          icon="search"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
      side="left"
      content-class="bg-white left-bar"
      content-style="overflow:hidden!important;"
      :width="400"
    >
      <q-toolbar
        class="bg-white"
        style="height:80px;"
      >
        <q-input
          class="full-width"
          bg-color="white"
          outlined
          dense
          v-model="search"
          :loading="loadSearch"
          @input="handleSearch"
          debounce="500"
          color="bg-grey-7"
          :placeholder="!searchMsg ? 'Search for words, agents in chats' : 'Search in conversation'"
          :hint="startDate.length > 0 && endDate.length > 0 ? 
          datePickerText(startDate,endDate) : ''"
        >
          <template v-slot:prepend>
            <q-icon
              v-if="search === ''"
              name="search"
            />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />

          </template>
          <template
            v-if="!searchMsg"
            v-slot:append
          >
            <q-btn
              flat
              round
              dense
              icon="event"
              :text-color="allowDateFilter ? 'primary' : 'blue-grey-2'"
              @click="handleCalendar"
            >

            </q-btn>
            <q-menu
              persistent
              no-parent-event
              :value="showCalendar"
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
              max-height="auto"
              content-style="max-height:none!important;"
            >
              <q-date
                v-model="proxyStartDate"
                mask="YYYY-MM-DD"
                class="full-height"
                minimal
              >
                <q-btn
                  class="cursor-inherit"
                  label=""
                  color="white"
                  flat
                  @click="()=>{}"
                />

              </q-date>
              <q-date
                v-model="proxyEndDate"
                mask="YYYY-MM-DD"
                class="full-height"
                minimal
              >

                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn
                    :label="allowDateFilter ? 'Deactivate' : 'Activate'"
                    color="primary"
                    flat
                    @click="saveDate"
                  />
                </div>
              </q-date>
            </q-menu>
          </template>
        </q-input>
      </q-toolbar>
      <div v-if="searchMsg">
        <q-toolbar class="bg-grey-3 text-grey-7">
          <div class="text-body2">
            Search text in
          </div>
        </q-toolbar>
        <chat-item
          class="bg-white bordered"
          :agents="currentChat.agents"
          :chat-id="currentChat.chat_id"
          :created-at="currentChat.created_at"
          :active="false"
        />
        <q-toolbar class="bg-grey-3 text-grey-7">
          <div class="text-body2">
            Search for text
          </div>
        </q-toolbar>
        <search-item
          v-for="(msg,index) in searchList"
          :key="'search-message-' + index"
          :content="msg.content"
          :name="msg.user_name"
          :created-at="msg.ts"
          :active="selectedMsg === msg.id"
          @go-to-text="goToText(msg.id)"
        />
      </div>

      <q-scroll-area
        v-if="!searchMsg"
        style="height: calc(100% - 80px)"
      >
        <div class="q-py-md q-px-md column items-center">
          <chat-item
            class="bg-white bordered"
            v-for="chat in chats"
            :key="chat.id + '-chat-item'"
            :agents="chat.agents"
            :chat-id="chat.chat_id"
            :created-at="chat.created_at"
            :active="currentChat.chat_id === chat.chat_id"
            @select-chat="handleChat(chat)"
          />
        </div>

      </q-scroll-area>
    </q-drawer>
    <q-drawer
      show-if-above
      side="right"
      bordered
      content-class="bg-zendesk column justify-between"
    >
      <div class="desired bg-white bordered">
        <q-toolbar>
          <div class="text-subtitle2">
            Desired Words Missing
          </div>
        </q-toolbar>
        <q-scroll-area
          class="full-width"
          style="height: calc(100% - 50px)"
        >
          <q-list>
            <q-item
              class="q-my-xs no-shadow word-on-list bordered"
              v-for="(desired,index) in desMissing"
              :key="desired.word + '-'+ index + '-' + '-missing-word'"
            >
              <q-item-section>{{desired.word}}</q-item-section>

            </q-item>
          </q-list>
        </q-scroll-area>

      </div>
      <div class="forbidden bg-white bordered">
        <q-toolbar class="bg-white">
          <div class="text-subtitle2">
            Forbidden Words
          </div>
        </q-toolbar>
        <q-scroll-area
          class="full-width"
          style="height: calc(100% - 50px)"
        >
          <q-list>
            <q-item
              class="q-my-xs no-shadow word-on-list bordered"
              clickable
              v-for="(forbidden,index) in forbiddens"
              :key="forbidden.word + '-'+ index + '-' + '-missing-word'"
            >
              <q-item-section>{{forbidden.word}}</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

    </q-drawer>
    <q-page-container class="fit column items-center messages-container">
      <q-scroll-area
        v-if="!loadingChat"
        class="fit q-py-md"
        ref="messageScrollArea"
      >
        <chat :messages="msgArr" />
      </q-scroll-area>
      <div
        v-else
        class="full-width full-height flex flex-center"
      >
        <div class="loading-btn bg-white q-pa-sm shadow-2">
          <q-spinner
            color="primary"
            size="2em"
          />
        </div>

      </div>
    </q-page-container>

  </q-layout>

</template>
<script>
import constant from '@/utils/constant.js'
import { date, QDate, QPopupProxy, QScrollArea, QDialog, QLayout, QHeader, QMenu, QPageContainer, QToolbar, QToolbarTitle, QDrawer, QInput, QIcon, QAvatar, QSpace, QBtn, QList, QItem, QItemSection, QSpinner } from 'quasar'
import ChatItem from './ChatItem'
import SearchItem from './SearchItem'
import Chat from './Chat'

export default {

  components: {
    QScrollArea,
    QLayout,
    QHeader,
    QPageContainer,
    QToolbar,
    QToolbarTitle,
    QDrawer,
    QInput,
    QIcon,
    QAvatar,
    QSpace,
    QBtn,
    QList,
    QItem,
    QItemSection,
    QSpinner,
    Chat,
    ChatItem,
    SearchItem,
    QDate,
    QPopupProxy,
    QDialog,
    QMenu
    // ChatItem: () => import('./ChatItem.vue'),
    // QScrollArea: () => import('quasar/src/components/scroll-area/QScrollArea.js'),
    // QLayout: () => import('quasar/src/components/layout/QLayout.js'),
    // QHeader: () => import('quasar/src/components/header/QHeader.js'),
    // QPageContainer: () => import('quasar/src/components/page/QPageContainer.js'),
    // QToolbar: () => import('quasar/src/components/toolbar/QToolbar.js'),
    // QToolbarTitle: () => import('quasar/src/components/toolbar/QToolbarTitle.js'),
    // QDrawer: () => import('quasar/src/components/drawer/QDrawer.js'),
    // QInput: () => import("quasar/src/components/input/QInput.js"),
    // QIcon: () => import('quasar/src/components/icon/QIcon.js'),
    // QAvatar: () => import('quasar/src/components/avatar/QAvatar.js'),
    // QSpace: () => import('quasar/src/components/space/QSpace.js'),
    // QBtn: () => import('quasar/src/components/btn/QBtn.js'),
    // Chat: () => import('./Chat.vue'),
    // QList: () =>
    //   import(
    //     /* webpackPrefetch: true  */ "quasar/src/components/item/QList.js"
    //   ),
    // QItem: () =>
    //   import(/* webpackPrefetch: true */ "quasar/src/components/item/QItem.js"),
    // QItemSection: () => import("quasar/src/components/item/QItemSection.js"),
    // QSpinner: () => import("quasar/src/components/spinner/QSpinner.js"),
    // SearchItem: () => import("./SearchItem.vue")

  },
  data () {
    return {
      search: '',
      searchMsg: false,
      chats: [],
      loadingChat: false,
      msgArr: [],
      currentChat: '',
      selectedMsg: '',
      currChatAgents: [],
      forbiddens: [],
      desMissing: [],
      searchList: [],
      loadSearch: false,
      proxyStartDate: '',
      proxyEndDate: '',
      startDate: '',
      endDate: '',
      allowDateFilter: false,
      showCalendar: false
    }
  },

  mounted () {
    this.getChats(false, true).then(res => {
      console.log("chats", res);
      if (res.results.length) {

        this.chats = res.results.map(chat => {
          chat.created_at = date.formatDate(chat.created_at, 'DD-MM-YYYY')
          return chat

        })

        this.handleChat(this.chats[0])

      }
    })
  },
  methods: {
    getChats (rules, end) {
      return this.$request.get(`${constant.API}/chats/?rules=${rules}&end=${end}`, constant.HEADER, constant.JWT)
    },
    getMessages (chatId) {
      return this.$request.get(`${constant.API}/messages/?chat=${chatId}`, constant.HEADER, constant.JWT)
    },
    handleChat (chat) {
      this.currentChat = chat
      const id = chat.chat_id
      this.loadChat()
      this.getMessages(id).then((res) => {
        console.log(res);
        this.msgArr = this.generateConv(res.results)
        this.forbiddens = this.forbiddenList(id)
        this.desMissing = this.desiredMissing(id)
        this.currChatAgents = this.currentChatAgent(res.results)
        this.loadingChat = false
      })
    },
    generateConv (messages) {
      let flag = null
      let conversation = []
      let arr = []
      messages.map((msg, index) => {
        if (msg.is_agent === flag) {
          arr.push(msg)
        } else {
          flag = msg.is_agent
          if (arr.length > 0) {
            conversation.push(arr)
            arr = []
            arr.push(msg)
          } else {
            arr.push(msg)
          }
        }
        if (index === messages.length - 1) {
          conversation.push(arr)
        }
      })
      console.log('conversation', conversation);
      return conversation
    },
    forbiddenList (id) {
      const chats = this.chats
      const chatIdx = chats.findIndex(chat => chat.chat_id === id)
      let forbiddens = []
      if (chatIdx > -1) {
        forbiddens = chats[chatIdx].forbidden_detected
        return forbiddens
      }
      return forbiddens
    },
    desiredMissing (id) {
      const chats = this.chats
      const chatIdx = chats.findIndex(chat => chat.chat_id === id)
      let missing = []
      if (chatIdx > -1) {
        missing = chats[chatIdx].desired_missing
        return missing
      }
      return missing
    },
    loadChat () {
      this.forbiddens = []
      this.desMissing = []
      this.msgArr = []
      this.loadingChat = true
    },
    currentChatAgent (messages) {
      const agents = messages.filter((msg, index, self) => {
        const isUnique = self.findIndex(m => m.user_id === msg.user_id) === index
        if (msg.is_agent && isUnique) {
          return msg
        }
      })
      return agents
    },
    viewChatAgents () {
      const currChatAgents = this.currChatAgents
      if (currChatAgents.length < 3) {
        return currChatAgents.filter((item, index) => item.user_name.split(' ')[0]).join(',')
      } else {
        return currChatAgents.filter((item, index) => { if (index < 3) return item.user_name.split(' ')[0] }).join(',') + ',...'
      }

    },
    searchInMsg () {
      this.search = ''
      this.searchList = []
      this.searchMsg = !this.searchMsg
      this.startDate = ''
      this.endDate = ''
    },
    handleSearch () {
      let search = this.search
      const chatId = this.currentChat.chat_id
      const startDate = date.isValid(this.startDate) ? this.startDate : false
      const endDate = date.isValid(this.endDate) ? this.endDate : false

      if (this.searchMsg && search.length) {
        this.loadSearch = true
        return this.$request.get(`${constant.API}/messages/?chat=${chatId}&content=${search}`, constant.HEADER, constant.JWT).then(res => {
          this.searchList = res.results.map(msg => {
            msg.ts = date.formatDate(msg.ts, 'DD-MM-YYYY')
            return msg
          })
          this.loadSearch = false
        })
      } else if (this.searchMsg && !search.length) {
        this.loadSearch = true
        this.searchList = []
        this.loadSearch = false
      }
      if (!this.searchMsg && search.length) {
        if (startDate && endDate && this.allowDateFilter) {
          this.loadSearch = true
          return this.$request.get(`${constant.API}/chats/?rules=False&end=True&search=${search}&date_gte=${startDate}&date_lte=${endDate}`, constant.HEADER, constant.JWT).then(res => {
            this.chats = res.results.map(chat => {
              chat.created_at = date.formatDate(chat.created_at, 'DD-MM-YYYY')
              return chat

            })
            this.loadSearch = false
          })
        } else {
          this.loadSearch = true
          return this.$request.get(`${constant.API}/chats/?rules=False&end=True&search=${search}&date_gte=${this.startDate}&date_lte=${this.endDate}`, constant.HEADER, constant.JWT).then(res => {
            this.chats = res.results.map(chat => {
              chat.created_at = date.formatDate(chat.created_at, 'DD-MM-YYYY')
              return chat

            })
            this.loadSearch = false
          })
        }

      } else if (!this.searchMsg && !search.length) {
        this.loadSearch = true
        return this.getChats(false, true).then(res => {
          console.log("chats", res);
          if (res.results.length) {
            this.chats = res.results.map(chat => {
              chat.created_at = date.formatDate(chat.created_at, 'DD-MM-YYYY')
              return chat
            })
          } else {
            this.chats = []
          }
          this.loadSearch = false
        })
      }
    },
    goToText (id) {
      this.selectedMsg = id
      // const messageCont = document.querySelector('.messages-container')
      const message = document.querySelector(`.message-${id}`)
      const position = message.offsetTop - message.clientHeight
      this.$refs.messageScrollArea.setScrollPosition(position)
      console.log(this.selectedMsg);
    },
    handleCalendar () {
      this.showCalendar = !this.showCalendar

    },
    saveDate () {
      this.allowDateFilter = !this.allowDateFilter
      if (this.allowDateFilter) {
        this.startDate = this.proxyStartDate
        this.endDate = this.proxyEndDate
      } else {
        this.startDate = ""
        this.endDate = ""
      }
      this.showCalendar = false
    },
    datePickerText (startDate, endDate) {
      console.log(startDate, endDate);
      const formatStart = date.formatDate(startDate, 'DD/MM/YYYY')
      const formatEnd = date.formatDate(endDate, 'DD/MM/YYYY')

      console.log(formatStart, formatEnd);
      return `Search between ${formatStart} and ${formatEnd}`
    }


  }
}
</script>
<style>
.bg-zendesk {
  background: #f8f9f9;
}
.bordered {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.desired,
.forbidden {
  height: 49%;
  border-left: none !important;
}
.desired {
  border-top: none !important;
}
.q-layout__section--marginal {
  background: none !important;
}
.loading-btn {
  border-radius: 50%;
}
</style>