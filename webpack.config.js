const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader'
      },
      {
        test: require.resolve('phaser'),
        loader: 'expose-loader',
        options: { exposes: { globalName: 'Phaser', override: true } }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname,"app"),
    open: true
  }
};
