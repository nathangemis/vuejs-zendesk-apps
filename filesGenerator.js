const manifest = require('./src/manifest.json')
const fs = require('fs')
const pretty = require('pretty')
const beautify = require('js-beautify')
const vueBeautify = require('vue-beautify')





function filesGenerator (products) {
  const regex = /(?<=\/)\w+(?=\.html)/gm
  for (const key in products) {
    if (products.hasOwnProperty(key)) {
      const product = products[key]
      for (const location in product) {
        if (product.hasOwnProperty(location)) {

          // create .vue files
          const vuePath = './src/components/'
          const split = location.split('_')
          const componentName = split[0][0].toUpperCase() + split[0].slice(1) + split[1][0].toUpperCase() + split[1].slice(1)
          const vueFile = componentName + '.vue'
          if (!fs.existsSync(vuePath + vueFile)) {
            const vueFileTemplate = `<template>
            <div></div>
          </template>
          <script>
          export default {};
          </script>
          <style>
          </style>`
            fs.writeFile(vuePath + vueFile, vueBeautify(vueFileTemplate), function (err) {
              if (err) throw err;
            });
          }

          // create JS files
          const srcPath = './src/'
          const jsFile = product[location].match(regex)[0] + '.js'
          if (!fs.existsSync(srcPath + jsFile)) {
            const jsTemplate = `import Vue from 'vue';
            import ${componentName} from './components/${vueFile}';
            import install from 'quasar/src/install.js';
            import * as directives from 'quasar/src/directives.js'
            import * as plugins from 'quasar/src/plugins.js'
            import ZAFClient from 'zendesk_app_framework_sdk'
            const client = ZAFClient.init()

            Vue.prototype.$client = client

            Vue.use({install},{
              directives,
              plugins
            })

            new Vue({
              el: '#${location}',
              render: h => h(${componentName}),
            })`;
            fs.writeFile(srcPath + jsFile, beautify(jsTemplate), function (err) {
              if (err) throw err;
            });
          }


          // create HTML files

          const htmlFile = product[location].match(regex)[0] + '.html'
          if (!fs.existsSync(srcPath + htmlFile)) {
            const htmlTemplate = `
                    <html>
                      <head>
                      <% _.forEach(htmlWebpackPlugin.options.vendorCss, function(css) { %><link type="text/css" rel="stylesheet" href="<%= css %>"><% }); %>
                      </head>
                      <body>
                        <div id="${location}"></div>
                      </body>
                    </html>`

            fs.writeFile(srcPath + htmlFile, pretty(htmlTemplate), function (err) {
              if (err) throw err;
            });
          }
        }
      }
    }
  }
}


function manifestReader () {
  const products = manifest.location
  filesGenerator(products)
}



manifestReader()


