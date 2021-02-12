// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('path');

const webpackConfig = require('./webpack.dev.config');

module.exports = config => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    files: [
      {pattern: 'test/*.ts'}
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.ts': ['webpack'],
      'test/**/*.js': ['webpack'],
    },

    webpack: {
      resolve: webpackConfig.resolve,
      mode: webpackConfig.mode,
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader'
          },
          {
            test: /\.ts$/,
            use: {loader: 'istanbul-instrumenter-loader'},
            enforce: 'post',
            exclude: /\.spec\.ts$/
          }

        ]
      },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage-istanbul'],

    // https://www.npmjs.com/package/karma-coverage-istanbul-reporter
    coverageIstanbulReporter: {
      dir: path.join(__dirname, 'coverage'),
      reports: ['text-summary', 'lcovonly', 'html'],
      fixWebpackSourcePaths: true,
      combineBrowserReports: true, // Combines coverage information from multiple browsers into one report
      skipFilesWithNoCoverage: true
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    //autoWatch: true,
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // global BrowserStack configuration
    browserStack: {
      forcelocal: true,  // force traffic through the local BrowserStack tunnel, passes flag through to BrowserStackTunnel
      project: 'tokenizer-http',
      timeout: 30,  // BROWSERSTACK_IDLE_TIMEOUT
      captureTimeout: 30
    },

    // define browsers, see https://www.browserstack.com/automate/capabilities
    customLaunchers: {
      bs_win_chrome: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Chrome',
        browser_version: '88.0'
      },
      bs_win_firefox: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Firefox',
        browser_version: '84.0'
      },
      bs_osx_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Big Sur',
        browser: 'Safari',
        browser_version: '14'
      },
      bs_win_edge: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Edge',
        browser_version: '88'
      }
    },

    // Increase time-outs to prevent disconnects on BrowserStack
    browserDisconnectTimeout : 20000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 4*60*1000, //default 10000
    captureTimeout : 4*60*1000, //default 60000
  })
};
