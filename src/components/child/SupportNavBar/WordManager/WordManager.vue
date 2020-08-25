<template>
  <div
    v-if="pageLoaded"
    class="row items-center justify-center full-height full-width"
  >
    <div class="row words-manager-container q-pa-xl justify-around items-center bg-white bordered">
      <desired-list
        :key="'desired-list-component'"
        @save="postDesWord"
        @delete="delDesiredWord"
        @clear-synonyms="clearSynonyms"
        @get-synonyms="getSynonyms"
        @load-synonyms="loadMoreDesSyn"
        :words="desiredWords"
        :synonyms="desiredSynonyms"
        :loadSynIdx="desSynLoadIndex"
        type="desired"
      />

      <forbidden-list
        :key="'forbidden-list-component'"
        @save="postForbWord"
        @delete="delForbiddenWord"
        @clear-synonyms="clearSynonyms"
        @get-synonyms="getSynonyms"
        @load-synonyms="loadMoreForbSyn"
        :words="forbiddenWords"
        :synonyms="forbiddenSynonyms"
        :loadSynIdx="forbSynLoadIndex"
        type="forbidden"
      />

      <q-dialog
        v-model="notif.show"
        seamless
        position="top"
      >
        <q-card>
          <div class="column items-center q-pa-sm">

            <div class="full-width row justify-end">
              <q-btn
                size="sm"
                flat
                round
                icon="close"
                v-close-popup
              />
            </div>
            <div class="text-subtitle1">{{notif.msg}}</div>
            <div class="row items-center">
              <div
                class="q-mr-xs text-caption"
                v-if="yetOnList.length > 1"
              >If you want to change some of that words to the other list</div>
              <div
                class="q-mr-xs text-caption"
                v-if="yetOnList.length === 1"
              >If you want to change it to the orther list</div>
              <q-btn
                size="sm"
                unelevated
                dense
                color="negative"
                label="click here"
                v-close-popup
                @click="swapList = true"
              />
            </div>

          </div>
          <q-linear-progress
            :value="1"
            color="negative"
          />
        </q-card>
      </q-dialog>

    </div>
    <q-dialog v-model="swapList">
      <q-card style="width:500px;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Select the words to swap</div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator />
        <q-card-section
          style="max-height: 50vh"
          class="scroll"
        >
          <q-item
            v-for="(w, index) in yetOnList"
            :key="w.word + '-' + index + 'yet-on-list'"
            class="items-center bordered q-ma-sm"
            @click="addToSwap(w)"
            clickable
          >
            <q-item-section>
              {{w.word}}
            </q-item-section>

            <q-item-section side>
              <q-checkbox
                left-label
                v-model="wordToSwap"
                :val="w"
              />
            </q-item-section>

          </q-item>
        </q-card-section>
        <q-separator />
        <q-card-section align="right">
          <q-btn
            flat
            label="Swap"
            color="primary"
            @click="swapWord"
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import constant from '@/utils/constant.js'
// import request from '@/utils/request.js'

export default {
  data () {
    return {
      pageLoaded: true,
      forbiddenWords: [],
      desiredWords: [],
      forbiddenSynonyms: [],
      desiredSynonyms: [],
      forbSynLoadIndex: 0,
      desSynLoadIndex: 0,
      yetOnList: [],
      notif: {
        show: false,
        msg: ''
      },
      swapList: false,
      columns: [{ name: 'words', align: 'center', label: 'Words', field: row => row.word, sortable: false }],
      wordToSwap: [],
      clientId: null
    };
  },
  components: {
    QDialog: () => import('quasar/src/components/dialog/QDialog.js'),
    QCard: () => import('quasar/src/components/card/QCard.js'),
    QCardSection: () => import('quasar/src/components/card/QCardSection.js'),
    QBtn: () => import('quasar/src/components/btn/QBtn.js'),
    QLinearProgress: () => import('quasar/src/components/linear-progress/QLinearProgress.js'),
    QTable: () => import('quasar/src/components/table/QTable'),
    QCheckbox: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/checkbox/QCheckbox.js"
      ),
    QItem: () =>
      import(/* webpackPrefetch: true */ "quasar/src/components/item/QItem.js"),
    QItemSection: () => import("quasar/src/components/item/QItemSection.js"),
    QSeparator: () => import("quasar/src/components/separator/QSeparator"),
    'desired-list': () => import("./WordList.vue"),
    'forbidden-list': () => import("./WordList.vue"),
  },
  created () {

    // this.$client.get('currentAccount').then(data => {
    //   console.log('current Account', data);
    // })

  },
  mounted () {

    console.log('app registered');
    this.$client.get('currentUser').then(data => {
      console.log('current User', data);
      constant.JWT.claims.sub = data.currentUser.role
    }).then(() => {
      this.getForbiddenWords().then(res => {
        console.log(res);
        this.forbiddenWords = res.results
      })
      this.getDesiredWords().then(res => {
        console.log(res);
        this.desiredWords = res.results
      })
    })

  },
  methods: {
    showNotif (value) {

      const yetOnList = this.yetOnList
      let msg = ''
      if (yetOnList.length > 4) {
        msg = `${yetOnList[0].word},${yetOnList[1].word},${yetOnList[2].word},... are on ${value} list.`
      } else if (yetOnList.length > 1) {
        for (let i = 0; i < yetOnList.length; i++) {
          if (i === yetOnList.length - 1) {
            msg += ` and ${yetOnList[i].word} are on ${value} list.`
          } else if (i === yetOnList.length - 2) {
            msg += `${yetOnList[i].word}`
          } else {
            msg += `${yetOnList[i].word},`
          }
        }
      } else {
        msg = `${yetOnList[0].word} is on ${value} list.`
      }
      this.notif.msg = msg
      this.notif.show = true

    },
    loadMoreForbSyn (word, start, stop) {
      const end = start + 10
      this.getSynonyms(word, start, end, 'forbidden').then(() => {
        stop(true)
      })
    },
    loadMoreDesSyn (word, start, stop) {
      const end = start + 10
      this.getSynonyms(word, start, end, 'desired').then(() => {
        stop(true)
      })
    },
    clearSynonyms (value, done) {
      const isForbidden = value === 'forbidden'
      const isDesired = value === 'desired'
      if (isForbidden) {
        this.forbiddenSynonyms = [];
        this.forbSynLoadIndex = 0;
        done(true)
      } else if (isDesired) {
        this.desiredSynonyms = [];
        this.desSynLoadIndex = 0
        done(true)
      }
    },
    getSynonyms (word, start, end, type) {
      const isDesired = type === 'desired'
      const isForbidden = type === 'forbidden'
      return this.$request.get(`${constant.API}/synonyms/?word=${word}&start=${start}&end=${end}`, constant.HEADER, constant.JWT).then(res => {
        console.log(res);
        if (isDesired) {
          this.desiredSynonyms = Object.freeze([...this.desiredSynonyms, ...res]);
          this.desSynLoadIndex += 10;        }
        if (isForbidden) {
          this.forbiddenSynonyms = Object.freeze([...this.forbiddenSynonyms, ...res]);
          this.forbSynLoadIndex += 10;
        }
      });
    },
    postForbWord (word, synonyms, done) {
      this.notif.show = false
      this.notif.msg = ""
      this.yetOnList = []
      const words = [{ word: word }, ...synonyms]
      const forbiddenArray = this.forbiddenWords
      return this.$request.post(`${constant.API}/forbiddenwords/`, words, constant.HEADER, constant.JWT).then(res => {
        console.log(res);
        const forbList = [...forbiddenArray, ...res.words]
        this.forbiddenWords = forbList
        this.clearSynonyms('forbidden', done => { })
        if (res.exist_in_des.length) {
          this.yetOnList = res.exist_in_des
          this.showNotif('desired')
        }
        done(true)
      }).catch(err => {
        this.clearSynonyms('forbidden', done => { })
        console.log(err);
      })
    },
    postDesWord (word, synonyms, done) {
      this.notif.show = false
      this.notif.msg = ""
      this.yetOnList = []
      const words = [{ word: word }, ...synonyms]
      const desiredArray = this.desiredWords
      return this.$request.post(`${constant.API}/desiredwords/`, words, constant.HEADER, constant.JWT).then((res) => {
        console.log(res);
        const desList = [...desiredArray, ...res.words]
        this.desiredWords = desList
        this.clearSynonyms('desired', done => { })
        if (res.exist_in_forb.length) {
          this.yetOnList = res.exist_in_forb
          this.showNotif('forbidden')
        }
        done(true)
      }).catch(err => {
        this.clearSynonyms('forbidden', done => { })
        console.log(err);
      })
    },
    getForbiddenWords () {
      return this.$request.get(`${constant.API}/forbiddenwords/`, constant.HEADER, constant.JWT)
    },
    delForbiddenWord (id) {
      const forbiddenArray = this.forbiddenWords;
      return this.$request.delete(`${constant.API}/forbiddenwords/${id}`, constant.HEADER, constant.JWT).then(res => {
        console.log(res);
        const index = forbiddenArray.findIndex(item => item.id === id)
        forbiddenArray.splice(index, 1);
        this.forbiddenWords = forbiddenArray;
      })
    },
    getDesiredWords () {
      return this.$request.get(`${constant.API}/desiredwords/`, constant.HEADER, constant.JWT)
    },
    delDesiredWord (id) {
      const desiredArray = this.desiredWords
      return this.$request.delete(`${constant.API}/desiredwords/${id}`, constant.HEADER, constant.JWT).then(res => {
        console.log(res);
        const index = desiredArray.findIndex(item => item.id === id)
        desiredArray.splice(index, 1);
        this.desiredWords = desiredArray;
      })
    },
    isOnOtherList (word, currentList) {
      const isDesired = currentList === 'desired'
      const isForbidden = currentList === 'forbidden'
      const forbiddenWords = this.forbiddenWords
      const desiredWords = this.desiredWords
      if (isDesired) {
        const idx = forbiddenWords.findIndex(item => item.word === word)
        if (idx > -1) {
          this.yetOnList.push(forbiddenWords[idx])
          return true
        }
      }
      if (isForbidden) {
        const idx = desiredWords.findIndex(item => item.word === word)
        if (idx > -1) {
          this.yetOnList.push(desiredWords[idx])
          return true
        }
      }
      return false
    },
    addToSwap (val) {
      const wordToSwap = this.wordToSwap
      const wordIdx = wordToSwap.findIndex(item => item.word === val.word)
      if (wordIdx > -1) {
        wordToSwap.splice(wordIdx, 1)
      } else {
        wordToSwap.push(val)
      }
      this.wordToSwap = wordToSwap
    },
    openSwapList () {

    }
  },
}
</script>

<style>
.words-manager-container {
  height: 90%;
  min-height: 90%;
  max-height: 90%;
  width: 90%;
  border-radius: 10px;
}
.bordered {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
