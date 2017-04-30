import webpackConfig from '../../webpack.config';
import webpack from 'webpack';
import project from '../aurelia.json';
import {CLIOptions, BuildOptions} from 'aurelia-cli';

const buildOptions = new BuildOptions(project.build.options);
const isProd = CLIOptions.getEnvironment() === 'prod';
const server = buildOptions.isApplicable('server');
const extractCss = buildOptions.isApplicable('extractCss');
const coverage = buildOptions.isApplicable('coverage');

const config = webpackConfig(isProd, server, extractCss, coverage);
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
