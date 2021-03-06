const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  


module.exports = (env, argv, mode) => {

    const envPath = `.env.${mode}`
    const dotenv = require('dotenv').config({path: envPath}).parsed
    const publicPath = dotenv.BaseHref

    return {
        mode,
        entry: {  
            app: './src/index.ts'  
        },
        output: {
            publicPath,
            path: __dirname,
            filename: "[name].bundle.js",
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
                loader: "pug-loader"
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
            new Dotenv({
                path: envPath
            }),
            new HtmlWebpackPlugin({  
            template: '!!pug-loader!src/index.pug',
            baseUrl: dotenv.BaseHref,
            appName: dotenv.AppName,
            googleMaps: dotenv.GoogleMaps,
            }),  
        ]
    }
}