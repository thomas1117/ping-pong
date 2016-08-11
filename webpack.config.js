module.exports = {
	entry: './app/app.js',
	output:{
	filename:__dirname + '/app/bundle.js',
	},
	devtool:'source-map',
	module:{
		loaders: [
	        {
	            test: /\.js$/,
	            loader: 'babel-loader'
	        }
    	]
	}
}