const webpack = require('webpack');
const config = require('./webpack.config');
const gutil = require('gulp-util');
const url = require('url');

const options = config(false, true, false, false);
const watchOptions = {};

// webpack(options).run(onBuild);
webpack(options).watch(watchOptions, onBuild);
console.log('\nWebpack is watching the files…\n');

function onBuild(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    process.exit(1);
  } else {
    process.stdout.write(stats.toString() + '\n');
  }
}
