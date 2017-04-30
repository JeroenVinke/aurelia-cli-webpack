const webpackConfig = require('../../webpack.config');
const webpack = require('webpack');

// production, server, extractCss, coverage
const config = webpackConfig(false, true, false, false);
const compiler = webpack(config);

function build(done) {
  compiler.run(onBuild);
  compiler.plugin('done', () => done());
}

function onBuild(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    process.exit(1);
  } else {
    process.stdout.write(stats.toString() + '\n');
  }
}

export {
  config,
  compiler,
  build as default
};

// import gulp from 'gulp';
// import transpile from './transpile';
// import processMarkup from './process-markup';
// import processCSS from './process-css';
// import copyFiles from './copy-files';
// import {build} from 'aurelia-cli';
// import project from '../aurelia.json';

// export default gulp.series(
//   readProjectConfiguration,
//   gulp.parallel(
//     transpile,
//     processMarkup,
//     processCSS,
//     copyFiles
//   ),
//   writeBundles
// );

// function readProjectConfiguration() {
//   return build.src(project);
// }

// function writeBundles() {
//   return build.dest();
// }
