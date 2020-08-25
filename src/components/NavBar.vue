<template>

  <q-layout
    class="words-manager-page no-scroll"
    view="hHh lpR fFf"
  >

    <q-header
      bordered
      height-hint="98"
      class="bg-transparent text-black"
    >
      <q-tabs
        align="left"
        dense
        no-caps
        indicator-color="positive"
      >
        <q-route-tab
          to="/"
          label="Word Manager"
        />
        <q-route-tab
          to="/activity"
          label="Activity"
        />
      </q-tabs>
    </q-header>

    <q-page-container class="full-height flex flex-center">
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script>
import { QLayout, QHeader, QTabs, QRouteTab, QPageContainer } from 'quasar'
export default {
  components: {
    QLayout,
    QHeader,
    QTabs,
    QRouteTab,
    QPageContainer
    // QLayout: () => import('quasar/src/components/layout/QLayout.js'),
    // QHeader: () => import('quasar/src/components/header/QHeader.js'),
    // QTabs: () => import('quasar/src/components/tabs/QTabs.js'),
    // QRouteTab: () => import('quasar/src/components/tabs/QRouteTab.js'),
    // QPageContainer: () => import('quasar/src/components/page/QPageContainer.js')

  },
  mounted () {
  }
};
</script>
<style>
.words-manager-page {
  width: 100%;
  height: 100%;
  background: #f8f9f9;
}
.container {
  height: 95%;
  max-height: 95%;
}
</style>