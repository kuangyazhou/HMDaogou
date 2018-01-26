'use strict';
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 是否为生产环境来改变构建流程
const isProd = process.env.NODE_ENV === 'production';
const minPostfix = isProd ? '.min' : '';
const minify = isProd ? 'minimize' : '';
const hash = '[hash:7]';

// 应用入口(发布, 开发)
const entry = ['./app/js/entry.js'];
const devEntry = [
  'babel-polyfill',
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client?reload=true',
  './app/js/entry.js'
];

// 基础控件
const basePlugins = [
  new webpack.LoaderOptionsPlugin({
    debug: !isProd,
    minimize: !isProd,
    options: {
      sassLoader: {
        includePaths: [
          path.resolve(__dirname, 'app/js'),
          path.resolve(__dirname, 'app/style')
        ]
      },
      postcss: [autoprefixer({ browsers: ['> 1% in CN', 'last 4 versions', 'iOS >= 8', 'Android >= 4.1'] })],
      context: path.join(__dirname, 'app'),
      output: {
        path: path.join(__dirname, 'public')
      },
    }
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new HTMLWebpackPlugin({
    title: '导购系统',
    template: 'app/index.html',
    // filename: `index.${hash}.html`,
    inject: 'body',
    prod: isProd,
    minify: isProd ? {
      removeComments: true,
      collapseWhitespace: true
    } : null,
  }),
];

// 生产环境使用的控件
const envPlugins = isProd ? [
  new ExtractTextPlugin({
    filename: `css/style.${hash}${minPostfix}.css`,
    allChunks: true,
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    sourceMap: 'inline-source-map'
  }),
  new webpack.BannerPlugin(`build: ${new Date().toString()}`),
] : [
    // new webpack.optimize.OccurenceOrderPlugin(), // OccurenceOrderPlugin is now by default.
    new webpack.HotModuleReplacementPlugin(),
    // @see https://www.npmjs.com/package/eslint-loader#noerrorsplugin
    new webpack.NoEmitOnErrorsPlugin(),
    // new BundleAnalyzerPlugin()
  ];

module.exports = {
  devtool: !isProd ? 'inline-source-map' : false,
  entry: isProd ? entry : devEntry,
  output: {
    path: path.join(__dirname, 'public'),
    filename: `app.${hash}${minPostfix}.js`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel?presets[]=react,presets[]=es2015!eslint-loader',
        exclude: /(node_modules|bower_components)/,
        include: [
          path.join(__dirname, 'app/js'),
          path.resolve(__dirname, 'node_modules/amazeui-touch/js'),
        ]
      },
      {
        test: /\.scss/,
        loader: isProd ?
          ExtractTextPlugin.extract({
            fallbackLoader: "style-loader",
            loader: "css?${minify}!postcss-loader!sass",
            publicPath: "/",
          })
          : `style!css!resolve-url?sourceMap!postcss-loader!resolve-url!sass?sourceMap`,
      },
      {
        test: /\.jpe?g$|\.gif$|\.png|\.ico$/,
        loaders: [
          'file?name=[path][name].[ext]&context=app',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      },
      { test: /\.txt$|\.json$|\.webapp$/, loader: 'file?name=[path][name].[ext]&context=app' },
      { test: /\.eot/, loader: 'url?limit=10&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' },
      { test: /\.svg/, loader: 'url?limit=10&mimetype=image/svg+xml&name=fonts/[name].[ext]' },
      { test: /\.woff/, loader: 'url?limit=10&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.woff2/, loader: 'url?limit=10&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf/, loader: 'url?limit=10&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
    ]
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  plugins: basePlugins.concat(envPlugins),

};
