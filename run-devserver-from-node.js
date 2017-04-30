const Server = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const open = require('opn');
const yargs = require('yargs');
const url = require('url');
const argv = yargs.argv;

argv.color = require('supports-color');

// production, server, extractCss, coverage
const config = webpackConfig(false, true, false, false);
const compiler = webpack(config);

var serve = false;
var watch = false;

if (serve) {
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

  let server = new Server(compiler, opts);

  server.listen(opts.port, opts.host, function(err) {
    if (err) throw err;
    reportReadiness(createDomain(), opts);
  });
} else {
  const watchOptions = {};

  if (watch) {
    compiler.watch(watchOptions, onBuild);
  } else {
    compiler.run(onBuild);
  }
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

function createDomain() {
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
