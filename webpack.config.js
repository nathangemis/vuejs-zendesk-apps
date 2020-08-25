const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const manifestFile = require('./src/manifest.json')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')



function getHtmlFiles () {
  let htmlFiles = []
  for (const prod in manifestFile.location) {
    for (const loc in manifestFile.location[prod]) {
      const regex = /(?<=\/)\w+(?=\.html)/gm
      const fileName = manifestFile.location[prod][loc].match(regex)[0]
      htmlFiles.push(fileName)
    }

  }
  return htmlFiles
}
function getEntryJsFiles () {
  const obj = {}
  for (const prod in manifestFile.location) {
    for (const loc in manifestFile.location[prod]) {
      const regex = /(?<=\/)\w+(?=\.html)/gm
      obj[manifestFile.location[prod][loc].match(regex)[0]] = `./src/${manifestFile.location[prod][loc].match(regex)[0]}.js`
    }
  }
  return obj
}
const externalAssets = {
  js: [
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js',
  ],
  css: [
    "https://cdn.jsdelivr.net/npm/quasar@1.9.7/dist/quasar.min.css",
    "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons",
  ]
}



let articlesHtmlPlugin = getHtmlFiles();

let multiplesFiles = articlesHtmlPlugin.map(function (entryName) {
  return new HtmlWebpackPlugin({
    inject: true,
    filename: `${entryName}.html`,
    template: `./src/${entryName}.html`,
    entryFile: entryName,
    vendorJs: externalAssets.js,
    vendorCss: externalAssets.css,
    chunksSortMode: (chunks) => {
      // console.log(entryName, chunks);
    }
  })
})


let buildPlugins = [
  // new BundleAnalyzerPlugin(),
  new CopyWebpackPlugin([
    { from: 'src/manifest.json', to: '../', flatten: true },
    { from: 'src/translations', to: '../translations', toType: 'dir', },
    { from: 'src/templates', to: './', toType: 'dir' },
    { from: './.zat', to: '../', flatten: true }
  ]),
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].css'
  }),
  new CleanWebpackPlugin(),
  // new webpack.optimize.AggressiveSplittingPlugin({
  //   minSize: 100,
  //   maxSize: 200
  // })
]

let devPlugins = [
  new VueLoaderPlugin(),
  new webpack.HotModuleReplacementPlugin(),

]

config = {
  prod: {
    mode: 'production',
    entry: getEntryJsFiles(),
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader' },
        { test: /\.vue$/, use: 'vue-loader' },
        {
          test: /\.css$/, use: [{
            loader: MiniCssExtractPlugin.loader
          }, 'css-loader']
        },
      ]
    },
    optimization: {
      // runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {

          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module, chunks) {
              // const allChunksNames = chunks.map((item) => item.name).join('~');
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `${packageName}`;
            },

          }
        }
      },
    },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: 'chunks/[name].[chunkhash].js',
      path: __dirname + '/dist/assets/',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve('src')
      }
    },
    plugins: [...multiplesFiles, ...buildPlugins,],
  },
  dev: {
    entry: getEntryJsFiles(),
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader' },
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      ]
    },
    output: {
      path: __dirname + '/dist/assets/',
      publicPath: './',
      filename: "[name].js"
    },
    devServer: {
      open: true,
      hot: true,
      port: 9001
    },
    plugins: [
      ...multiplesFiles, ...devPlugins,
    ]
  }
}





module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // console.log(env);
    return config.dev
  }

  if (argv.mode === 'production') {
    // console.log(argv);
    return config.prod
  }
  return config.prod
};