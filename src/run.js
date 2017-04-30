const webpack = require('webpack');
const config = require('./webpack.config');
const gutil = require('gulp-util');

// console.log();

webpack(config(false, true, false, false)).run(onBuild);

function onBuild(err, stats) {
  if (err) {
    console.log(err);
  } else {

    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    // var cache = [];
    // console.log(JSON.stringify(stats, function(key, value) {
    //     if (typeof value === 'object' && value !== null) {
    //         if (cache.indexOf(value) !== -1) {
    //             // Circular reference found, discard key
    //             return;
    //         }
    //         // Store value in our collection
    //         cache.push(value);
    //     }
    //     return value;
    // }));
    // cache = null; // Enable garbage collection


    Object.keys(stats.compilation.assets).forEach(function(key) {
      gutil.log('Webpack: output ', gutil.colors.green(key));
    });
    // gutil.log('Webpack: ', gutil.colors.blue('finished ', stats.compilation.name));
  }
}
