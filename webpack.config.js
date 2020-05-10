const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  
  
module.exports = {  
  mode: 'development',  
  entry: {  
    app: './src/index.ts'  
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].bundle.js",
  },
  devtool: 'source-map',
  devServer: {  
    contentBase: './dist',  
    overlay: true
  },  
  resolve: {  
    extensions: ['.js', '.ts', '.styl', 'pug']  
  }, 
  module: {  
    rules: [  
      {  
        test: /\.ts$/,  
        exclude: /node_modules/,  
        loader: 'ts-loader'  
      },
      {
        test: /\.(png|svg|jpg|gif|jfif)$/,
        use: [
          'file-loader',
        ],
      },
      { 
        test: /\.pug$/,
        use: ["pug-loader"]
      },
      {
        test: /\.styl$/,
        loader: [
            'style-loader',
            'css-loader',
            'stylus-loader'
        ]
      },
      {  
        test: /\.html$/,
        use: 'html-loader'
      }  
    ]  
  },  
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({  
      template: './src/index.pug'  
    }),  
  ]
};