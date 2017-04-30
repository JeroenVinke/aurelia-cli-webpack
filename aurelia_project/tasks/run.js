const Server = require('webpack-dev-server');
import {compiler, config} from './build';
const open = require('opn');
const yargs = require('yargs');
const url = require('url');
const argv = yargs.argv;
import {CLIOptions} from 'aurelia-cli';

argv.color = require('supports-color');

function run(done) {
  let opts = {
    host: 'localhost',
    publicPath: config.output.publicPath,
    filename: config.output.filename,
    watchOptions: undefined,
    hot: false,
    hotOnly: false,
    clientLogLevel: 'info',
    port: 8080,
    open: false,
    stats: {
      cached: false,
      cachedAssets: false,
      colors: argv.color
    }
  };

  if (!CLIOptions.hasFlag('watch')) {
    opts.watch = false;
  }

  let server = new Server(compiler, opts);

  server.listen(opts.port, opts.host, function(err) {
    if (err) throw err;
    reportReadiness(createDomain(opts), opts);
    done();
  });
}

function reportReadiness(uri, options) {
  const useColor = argv.color;

  let startSentence = `Project is running at ${colorInfo(useColor, uri)}`;

  if (options.socket) {
    startSentence = `Listening to socket at ${colorInfo(useColor, options.socket)}`;
  }
  console.log((argv.progress ? '\n' : '') + startSentence);

  console.log(`webpack output is served from ${colorInfo(useColor, options.publicPath)}`);
  const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(', ') : options.contentBase;

  if (contentBase) {
    console.log(`Content not from webpack is served from ${colorInfo(useColor, contentBase)}`);
  }

  if (options.historyApiFallback) {
    console.log(`404s will fallback to ${colorInfo(useColor, options.historyApiFallback.index || '/index.html')}`);
  }

  if (options.open) {
    open(uri).catch(function() {
      console.log('Unable to open browser. If you are running in a headless environment, please do not use the open flag.');
    });
  }
}

function createDomain(opts) {
  const protocol = opts.https ? 'https' : 'http';

  // the formatted domain (url without path) of the webpack server
  return opts.public ? `${protocol}://${opts.public}` : url.format({
    protocol: protocol,
    hostname: opts.host,
    port: opts.socket ? 0 : opts.port.toString()
  });
}

function colorInfo(useColor, msg) {
  if (useColor) {
    // Make text blue and bold, so it *pops*
    return `\u001b[1m\u001b[33m${msg}\u001b[39m\u001b[22m`;
  }
  return msg;
}


export { run as default };





// import gulp from 'gulp';
// import browserSync from 'browser-sync';
// import historyApiFallback from 'connect-history-api-fallback/lib';
// import project from '../aurelia.json';
// import build from './build';
// import {CLIOptions} from 'aurelia-cli';

// function log(message) {
//   console.log(message); //eslint-disable-line no-console
// }

// function onChange(path) {
//   log(`File Changed: ${path}`);
// }

// function reload(done) {
//   browserSync.reload();
//   done();
// }

// let serve = gulp.series(
//   build,
//   done => {
//     browserSync({
//       online: false,
//       open: false,
//       port: 9000,
//       logLevel: 'silent',
//       server: {
//         baseDir: [project.platform.baseDir],
//         middleware: [historyApiFallback(), function(req, res, next) {
//           res.setHeader('Access-Control-Allow-Origin', '*');
//           next();
//         }]
//       }
//     }, function(err, bs) {
//       if (err) return done(err);
//       let urls = bs.options.get('urls').toJS();
//       log(`Application Available At: ${urls.local}`);
//       log(`BrowserSync Available At: ${urls.ui}`);
//       done();
//     });
//   }
// );

// let refresh = gulp.series(
//   build,
//   reload
// );

// let watch = function(refreshCb, onChangeCb) {
//   return function(done) {
//     gulp.watch(project.transpiler.source, refreshCb).on('change', onChangeCb);
//     gulp.watch(project.markupProcessor.source, refreshCb).on('change', onChangeCb);
//     gulp.watch(project.cssProcessor.source, refreshCb).on('change', onChangeCb);

//     //see if there are static files to be watched
//     if (typeof project.build.copyFiles === 'object') {
//       const files = Object.keys(project.build.copyFiles);
//       gulp.watch(files, refreshCb).on('change', onChangeCb);
//     }
//   };
// };

// let run;

// if (CLIOptions.hasFlag('watch')) {
//   run = gulp.series(
//     serve,
//     watch(refresh, onChange)
//   );
// } else {
//   run = serve;
// }

// export { run as default, watch };
