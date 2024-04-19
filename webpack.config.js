const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    options: './src/option.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/option.html', to: 'option.html' },
        { from: 'src/option.js', to: 'option.js' },
        { from: 'src/activity-modal.html', to: 'activity-modal.html' },
        { from: 'src/enter-key-modal.html', to: 'enter-key-modal.html' },
        { from: 'src/enter-key-modal.js', to: 'enter-key-modal.js' },
        { from: 'manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
};