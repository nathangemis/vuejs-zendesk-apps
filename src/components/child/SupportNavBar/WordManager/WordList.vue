<template>
  <div class="full-height todo-words-container column justify-around">
    <div class="row justify-between input-container">
      <q-input
        :input-class="type+'-input'"
        :ref="type"
        square
        outlined
        v-model="inputWord"
        @keyup.enter="postWord"
        @keyup.delete="error.isErr = false"
        @input="handleInput"
        @focus="handleFocus"
        :loading="inputWord.length && !synonyms.length ? true : false"
        clearable
        clear-icon="close"
        class="input-word"
        :label="inputLabel"
        :error="error.isErr"
        :color="type === 'desired' ? 'positive' : 'negative'"
        debounce="500"
      >

        <q-menu
          class="q-pa-md"
          no-parent-event
          v-model="showMenu"
          auto-close
          no-focus
          fit
        >
          <q-list class="fit">
            <q-infinite-scroll
              @load="loadMoreSyn"
              :offset="50"
            >
              <div
                v-for="(syn,index) in synonyms"
                :key="syn + '-'+ index"
              >
                <q-item clickable>
                  <q-item-section>
                    <q-checkbox
                      v-model="synSelected"
                      :val="syn"
                      :label="syn.word"
                    />
                  </q-item-section>
                </q-item>
                <q-separator />
              </div>
              <template v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots
                    color="primary"
                    size="40px"
                  />
                </div>
              </template>
            </q-infinite-scroll>
          </q-list>
        </q-menu>

        <template v-slot:error>{{error.msg}}</template>

      </q-input>
      <q-btn
        :loading="loadPost"
        :color="type === 'desired' ? 'positive' : 'negative'"
        outline
        label="add"
        class="send-btn"
        @click="postWord"
      ></q-btn>
    </div>

    <div class="block-words">
      <q-card class="no-shadow bordered full-height full-width bg-white">
        <q-scroll-area class="full-height full-width">
          <q-list>
            <transition-group name="list-complete">
              <q-item
                class="q-my-md no-shadow word-on-list bordered"
                v-for="(w,index) in words"
                :key="w.word + '-'+ index + '-' + type + '-word'"
              >
                <q-item-section>{{w.word}}</q-item-section>
                <q-item-section side>
                  <q-btn
                    class="bordered"
                    flat
                    text-color="negative"
                    size="xs"
                    icon="remove"
                    @click="deleteWord(w.id)"
                    round
                  >
                    <q-tooltip>delete</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </transition-group>
          </q-list>
        </q-scroll-area>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'word-list',
  props: ['words', 'synonyms', 'loadSynIdx', 'type'],
  data () {
    return {
      inputWord: '',
      showLoad: false,
      loadPost: false,
      inputLabel: '',
      error: {
        isErr: false,
        msg: ''
      },
      synSelected: [],

    }
  },
  components: {
    QInput: () => import("quasar/src/components/input/QInput.js"),
    QList: () =>
      import(
        /* webpackPrefetch: true  */ "quasar/src/components/item/QList.js"
      ),
    QBtn: () => import("quasar/src/components/btn/QBtn.js"),
    QCard: () => import("quasar/src/components/card/QCard.js"),
    QScrollArea: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/scroll-area/QScrollArea.js"
      ),
    QItem: () =>
      import(/* webpackPrefetch: true */ "quasar/src/components/item/QItem.js"),
    QItemSection: () => import("quasar/src/components/item/QItemSection.js"),
    QTooltip: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/tooltip/QTooltip.js"
      ),
    QMenu: () =>
      import("quasar/src/components/menu/QMenu.js"),
    QSeparator: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/separator/QSeparator.js"
      ),
    QCheckbox: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/checkbox/QCheckbox.js"
      ),
    QInfiniteScroll: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/infinite-scroll/QInfiniteScroll"
      ),
    QSpinnerDots: () =>
      import(
        /* webpackPrefetch: true */ "quasar/src/components/spinner/QSpinnerDots"
      ),
  },
  computed: {
    showMenu () {
      if (this.synonyms.length) {
        console.log(this.synonyms);
        return true
      }
      return false
    }
  },
  created () {
    this.inputLabel = `Type a ${this.type} word`
  },
  methods: {
    initState () {
      this.inputWord = ''
      this.showLoad = false,
        this.inputLabel = `Type a ${this.type} word`,
        this.error = {
          isErr: false,
          msg: ''
        }
      this.synSelected = []
      this.loadPost = false
    },
    postWord () {
      const type = this.type
      const word = this.inputWord
      const synonyms = this.synSelected
      if (!word.length) {
        this.error.isErr = true
        this.error.msg = "You can't add an empty string"
      } else {
        this.loadPost = true
        this.$emit('save', word, synonyms, done => {
          this.$nextTick(() => {
            if (done === true) {
              this.initState()
            }
          })
        })
      }
    },
    handleInput () {
      this.error.isErr = false
      const type = this.type
      const word = this.inputWord
      if (word && word.length) {
        this.$emit('clear-synonyms', type, done => {
          this.$nextTick(() => {
            if (done === true) {
              this.showLoad = true
              this.inputLabel = "Looking for related words"
              const start = this.loadSynIdx
              const end = start + 10
              this.$emit('get-synonyms', word, start, end, type)
            }
          })
        })
      } else {
        this.$emit('clear-synonyms', type, done => {
          if (done === true) {
            this.initState()
            this.inputLabel = `Type ${type} a word`
          }
        })

      }
    },
    handleFocus () {
      if (this.synonyms.length && this.inputWord && this.inputWord.length) {
        this.showMenu = true
      }
    },
    loadMoreSyn (index, done) {
      const word = this.inputWord
      const start = this.loadSynIdx
      if (this.synonyms.length >= 100) {
        done(true)
      } else {
        this.$emit('load-synonyms', word, start, stop => {
          this.$nextTick(() => {
            if (stop === true) {
              done()
            }
          })
        })
      }

    },
    deleteWord (id) {
      this.$emit('delete', id)
    }
  }
}
</script>

<style scoped>
.todo-words-container {
  width: 30%;
}
.block-words {
  height: 80%;
}
.input-container {
  max-height: 56px;
}
.input-word {
  width: 70%;
}
.send-btn {
  height: 56px;
  width: 25%;
}

.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.word-on-list {
  min-width: 90% !important;
  transition: transform 0.5s;
  margin-left: 5%;
  margin-right: 5%;
}
</style>