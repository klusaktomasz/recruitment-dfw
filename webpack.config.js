const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (_env, argv) => {
  const devMode = argv.mode !== 'production';

  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'js/[name].[contenthash].js'
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              }
            },
            'css-loader',
            'postcss-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[hash].css',
        chunkFilename: devMode ? '[id].css' : '[hash].css',
      }),
      new CopyPlugin({
        patterns: [{
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'docs'),
          globOptions: {
            ignore: ['public/index.html']
          }
        }],
      }),
    ],
    devServer: {
      compress: true,
      historyApiFallback: true,
      overlay: true,
      stats: 'errors-only',
    }
  }
};
