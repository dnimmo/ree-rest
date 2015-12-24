module.exports = {
  name: 'server',
  target: 'node',
  context: __dirname,
  entry: './app.js',
	output: {
		path: __dirname+"/src",
		filename: "main.js",
	},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
