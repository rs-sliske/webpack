const inProduction = process.env.NODE_ENV === 'production';

const webpack = require('webpack');

const glob = require('glob');
const path = require('path');

const StatsPlugin = require('stats-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');

var config = {
	entry: {
		app: [
			'./src/js/app.js',
			'./src/css/app.scss',
		]
	},
	output: {
		path: __dirname + '/bin',
		filename: '[name].js',
	},
	module:{
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'env', 
								{
									cacheDirectory: true,
									uglify: true,
								},
							],
						],
					},
				},
			},
			{
				test: /\.s[ac]ss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
		        }),
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
		        }),
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
		],
	},
	plugins: [
		new StatsPlugin('manifest.json', {
			assets: true,
		}),

		new ExtractTextPlugin("[name].css"),

		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, './*.html')),
			minimize: inProduction,
		}),

		new webpack.LoaderOptionsPlugin({
			minimize: inProduction,
		})
	],
}

if(inProduction){
	const UglifyJSPlugin = require('uglifyjs-webpack-plugin');	


	config.plugins.push(
		new webpack.NoEmitOnErrorsPlugin(),
		new UglifyJSPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin()
	);
}

module.exports = config;