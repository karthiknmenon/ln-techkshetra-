'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = parseOptions;

var _path = require('path');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _proxy = require('contentful-batch-libs/dist/proxy');

var _package = require('../package');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseOptions(params) {
  const defaultOptions = {
    environmentId: 'master',
    exportDir: process.cwd(),
    includeDrafts: false,
    includeArchived: false,
    skipRoles: false,
    skipContentModel: false,
    skipContent: false,
    skipWebhooks: false,
    maxAllowedLimit: 1000,
    saveFile: true,
    useVerboseRenderer: false,
    rawProxy: false
  };

  const configFile = params.config ? require((0, _path.resolve)(process.cwd(), params.config)) : {};

  const options = _extends({}, defaultOptions, configFile, params);

  // Validation
  if (!options.spaceId) {
    throw new Error('The `spaceId` option is required.');
  }

  if (!options.managementToken) {
    throw new Error('The `managementToken` option is required.');
  }

  const proxySimpleExp = /.+:\d+/;
  const proxyAuthExp = /.+:.+@.+:\d+/;
  if (options.proxy && !(proxySimpleExp.test(options.proxy) || proxyAuthExp.test(options.proxy))) {
    throw new Error('Please provide the proxy config in the following format:\nhost:port or user:password@host:port');
  }

  options.startTime = (0, _moment2.default)();
  options.contentFile = options.contentFile || `contentful-export-${options.spaceId}-${options.environmentId}-${options.startTime.format('YYYY-MM-DDTHH-mm-SS')}.json`;

  options.logFilePath = (0, _path.resolve)(options.exportDir, options.contentFile);

  if (!options.errorLogFile) {
    options.errorLogFile = (0, _path.resolve)(options.exportDir, `contentful-export-error-log-${options.spaceId}-${options.environmentId}-${options.startTime.format('YYYY-MM-DDTHH-mm-SS')}.json`);
  } else {
    options.errorLogFile = (0, _path.resolve)(process.cwd(), options.errorLogFile);
  }

  // Further processing
  options.accessToken = options.managementToken;

  if (typeof options.proxy === 'string') {
    options.proxy = (0, _proxy.proxyStringToObject)(options.proxy);
  }

  if (!options.rawProxy && options.proxy) {
    options.httpsAgent = (0, _proxy.agentFromProxy)(options.proxy);
    delete options.proxy;
  }

  if (options.queryEntries && options.queryEntries.length > 0) {
    const querystr = options.queryEntries.join('&');
    options.queryEntries = _querystring2.default.parse(querystr);
  }

  if (options.queryAssets && options.queryAssets.length > 0) {
    const querystr = options.queryAssets.join('&');
    options.queryAssets = _querystring2.default.parse(querystr);
  }

  if (options.contentOnly) {
    options.skipRoles = true;
    options.skipContentModel = true;
    options.skipWebhooks = true;
  }

  options.application = options.managementApplication || `contentful.export/${_package.version}`;
  options.feature = options.managementFeature || `library-export`;
  return options;
}
module.exports = exports['default'];