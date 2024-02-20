const path = require('path');

module.exports = {
  entry: {
    app: './src/client/index.js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src/client'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'www/js/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'src/client'),
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: 'defaults',
            }],
            '@babel/preset-react',
          ],
        },
      },
    ],
  },
};
