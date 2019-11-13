'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFullSourceSpace;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _listr = require('listr');

var _listr2 = _interopRequireDefault(_listr);

var _listrVerboseRenderer = require('listr-verbose-renderer');

var _listrVerboseRenderer2 = _interopRequireDefault(_listrVerboseRenderer);

var _listr3 = require('contentful-batch-libs/dist/listr');

var _logging = require('contentful-batch-libs/dist/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_ALLOWED_LIMIT = 1000;
let pageLimit = MAX_ALLOWED_LIMIT;

/**
 * Gets all the content from a space via the management API. This includes
 * content in draft state.
 */
function getFullSourceSpace({
  client,
  spaceId,
  environmentId = 'master',
  skipContentModel,
  skipContent,
  skipWebhooks,
  skipRoles,
  includeDrafts,
  includeArchived,
  maxAllowedLimit,
  listrOptions,
  queryEntries,
  queryAssets
}) {
  pageLimit = maxAllowedLimit || MAX_ALLOWED_LIMIT;
  listrOptions = listrOptions || {
    renderer: _listrVerboseRenderer2.default
  };

  return new _listr2.default([{
    title: 'Connecting to space',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return client.getSpace(spaceId).then(space => {
        ctx.space = space;
        return space.getEnvironment(environmentId);
      }).then(environment => {
        ctx.environment = environment;
      });
    })
  }, {
    title: 'Fetching content types data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.environment, method: 'getContentTypes' }).then(extractItems).then(items => {
        ctx.data.contentTypes = items;
      });
    }),
    skip: () => skipContentModel
  }, {
    title: 'Fetching editor interfaces data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return getEditorInterfaces(ctx.data.contentTypes).then(editorInterfaces => {
        ctx.data.editorInterfaces = editorInterfaces.filter(editorInterface => {
          return editorInterface !== null;
        });
      });
    }),
    skip: ctx => skipContentModel || ctx.data.contentTypes.length === 0 && 'Skipped since no content types downloaded'
  }, {
    title: 'Fetching content entries data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.environment, method: 'getEntries', query: queryEntries }).then(extractItems).then(items => filterDrafts(items, includeDrafts)).then(items => filterArchived(items, includeArchived)).then(items => {
        ctx.data.entries = items;
      });
    }),
    skip: () => skipContent
  }, {
    title: 'Fetching assets data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.environment, method: 'getAssets', query: queryAssets }).then(extractItems).then(items => filterDrafts(items, includeDrafts)).then(items => filterArchived(items, includeArchived)).then(items => {
        ctx.data.assets = items;
      });
    }),
    skip: () => skipContent
  }, {
    title: 'Fetching locales data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.environment, method: 'getLocales' }).then(extractItems).then(items => {
        ctx.data.locales = items;
      });
    }),
    skip: () => skipContentModel
  }, {
    title: 'Fetching webhooks data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.space, method: 'getWebhooks' }).then(extractItems).then(items => {
        ctx.data.webhooks = items;
      });
    }),
    skip: () => skipWebhooks || environmentId !== 'master' && 'Webhooks can only be exported from master environment'
  }, {
    title: 'Fetching roles data',
    task: (0, _listr3.wrapTask)((ctx, task) => {
      return pagedGet({ source: ctx.space, method: 'getRoles' }).then(extractItems).then(items => {
        ctx.data.roles = items;
      });
    }),
    skip: () => skipRoles || environmentId !== 'master' && 'Roles can only be exported from master environment'
  }], listrOptions);
}

function getEditorInterfaces(contentTypes) {
  return _bluebird2.default.map(contentTypes, (contentType, index, length) => {
    return contentType.getEditorInterface().then(editorInterface => {
      _logging.logEmitter.emit('info', `Fetched editor interface for ${contentType.name}`);
      return editorInterface;
    }).catch(() => {
      // old contentTypes may not have an editor interface but we'll handle in a later stage
      // but it should not stop getting the data process
      _logging.logEmitter.emit('warning', `No editor interface found for ${contentType}`);
      return _bluebird2.default.resolve(null);
    });
  }, {
    concurrency: 6
  });
}

/**
 * Gets all the existing entities based on pagination parameters.
 * The first call will have no aggregated response. Subsequent calls will
 * concatenate the new responses to the original one.
 */
function pagedGet({ source, method, skip = 0, aggregatedResponse = null, query = null }) {
  const fullQuery = Object.assign({}, {
    skip: skip,
    limit: pageLimit,
    order: 'sys.createdAt,sys.id'
  }, query);

  return source[method](fullQuery).then(response => {
    if (!aggregatedResponse) {
      aggregatedResponse = response;
    } else {
      aggregatedResponse.items = aggregatedResponse.items.concat(response.items);
    }
    const page = Math.ceil(skip / pageLimit) + 1;
    const pages = Math.ceil(response.total / pageLimit);
    _logging.logEmitter.emit('info', `Fetched ${aggregatedResponse.items.length} of ${response.total} items (Page ${page}/${pages})`);
    if (skip + pageLimit <= response.total) {
      return pagedGet({ source, method, skip: skip + pageLimit, aggregatedResponse, query });
    }
    return aggregatedResponse;
  });
}

function extractItems(response) {
  return response.items;
}

function filterDrafts(items, includeDrafts) {
  return includeDrafts ? items : items.filter(item => !!item.sys.publishedVersion || !!item.sys.archivedVersion);
}

function filterArchived(items, includeArchived) {
  return includeArchived ? items : items.filter(item => !item.sys.archivedVersion);
}
module.exports = exports['default'];