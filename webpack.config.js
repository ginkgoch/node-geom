const path = require('path');
module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.ts'),
  watch: false,
  target: "node",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'tests'),
      ],
      loader: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts']
  },
  externals: {
    "lodash": {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_"
    },
    "jsts": {
      commonjs: "jsts",
      commonjs2: "jsts",
      amd: "jsts",
      root: "jsts"
    },
  },
  devtool: 'source-map'
};