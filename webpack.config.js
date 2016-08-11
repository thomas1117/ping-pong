module.exports = {
	entry: './app/app.js',
	output:{
	filename:__dirname + '/app/bundle.js',
	},
	module:{
		loaders: [
	        {
	            test: /\.js$/,
	            loader: 'babel-loader'
	        }
    	]
	}
}