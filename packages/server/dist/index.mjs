var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../utils/dist/index.js
var require_dist = __commonJS({
  "../utils/dist/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      getEnvAsBool: () => getEnvAsBool,
      getEnvAsInt: () => getEnvAsInt,
      getEnvAsStr: () => getEnvAsStr2,
      getErrorMessage: () => getErrorMessage,
      getFormattedZodError: () => getFormattedZodError,
      snakeToCamel: () => snakeToCamel
    });
    module.exports = __toCommonJS(src_exports);
    var getEnvAsStr2 = (key) => {
      const value = process.env[key];
      if (!value)
        throw new Error(`Missing environment variable ${key}`);
      return value;
    };
    var getEnvAsInt = (key) => {
      const value = getEnvAsStr2(key);
      const parsed = parseInt(value);
      if (isNaN(parsed))
        throw new Error(`Environment variable ${key} is not a number`);
      return parsed;
    };
    var getEnvAsBool = (key) => {
      const value = getEnvAsStr2(key);
      if (value === "true")
        return true;
      if (value === "false")
        return false;
      throw new Error(`Environment variable ${key} is not a boolean`);
    };
    var snakeToCamel = (str) => str.toLowerCase().replace(
      /([-_][a-z])/g,
      (group) => group.toUpperCase().replace("-", "").replace("_", "")
    );
    var getErrorMessage = (error) => {
      if (error instanceof Error) {
        return error.message;
      }
      if (typeof error === "string") {
        return error;
      }
      return "Unknown error";
    };
    var getFormattedZodError = (error) => error.issues.map((i) => i.message).join(", ");
  }
});

// src/trpc.ts
var import_utils7 = __toESM(require_dist());

// node_modules/@trpc/server/dist/unstable-core-do-not-import/utils.mjs
function invert(obj) {
  const newObj = /* @__PURE__ */ Object.create(null);
  for (const key in obj) {
    const v = obj[key];
    newObj[v] = key;
  }
  return newObj;
}
function mergeWithoutOverrides(obj1, ...objs) {
  const newObj = Object.assign(/* @__PURE__ */ Object.create(null), obj1);
  for (const overrides of objs) {
    for (const key in overrides) {
      if (key in newObj && newObj[key] !== overrides[key]) {
        throw new Error(`Duplicate key ${key}`);
      }
      newObj[key] = overrides[key];
    }
  }
  return newObj;
}
function isObject(value) {
  return !!value && !Array.isArray(value) && typeof value === "object";
}
function omitPrototype(obj) {
  return Object.assign(/* @__PURE__ */ Object.create(null), obj);
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/rpc/codes.mjs
var TRPC_ERROR_CODES_BY_KEY = {
  /**
  * Invalid JSON was received by the server.
  * An error occurred on the server while parsing the JSON text.
  */
  PARSE_ERROR: -32700,
  /**
  * The JSON sent is not a valid Request object.
  */
  BAD_REQUEST: -32600,
  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,
  // Implementation specific errors
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32003,
  NOT_FOUND: -32004,
  METHOD_NOT_SUPPORTED: -32005,
  TIMEOUT: -32008,
  CONFLICT: -32009,
  PRECONDITION_FAILED: -32012,
  PAYLOAD_TOO_LARGE: -32013,
  UNPROCESSABLE_CONTENT: -32022,
  TOO_MANY_REQUESTS: -32029,
  CLIENT_CLOSED_REQUEST: -32099
};
var TRPC_ERROR_CODES_BY_NUMBER = invert(TRPC_ERROR_CODES_BY_KEY);

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/getHTTPStatusCode.mjs
var JSONRPC2_TO_HTTP_CODE = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
};
function getStatusCodeFromKey(code) {
  return JSONRPC2_TO_HTTP_CODE[code] ?? 500;
}
function getHTTPStatusCode(json) {
  const arr = Array.isArray(json) ? json : [
    json
  ];
  const httpStatuses = new Set(arr.map((res) => {
    if ("error" in res) {
      const data = res.error.data;
      if (typeof data.httpStatus === "number") {
        return data.httpStatus;
      }
      const code = TRPC_ERROR_CODES_BY_NUMBER[res.error.code];
      return getStatusCodeFromKey(code);
    }
    return 200;
  }));
  if (httpStatuses.size !== 1) {
    return 207;
  }
  const httpStatus = httpStatuses.values().next().value;
  return httpStatus;
}
function getHTTPStatusCodeFromError(error) {
  return getStatusCodeFromKey(error.code);
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/getErrorShape.mjs
function getErrorShape(opts) {
  const { path, error, config } = opts;
  const { code } = opts.error;
  const shape = {
    message: error.message,
    code: TRPC_ERROR_CODES_BY_KEY[code],
    data: {
      code,
      httpStatus: getHTTPStatusCodeFromError(error)
    }
  };
  if (config.isDev && typeof opts.error.stack === "string") {
    shape.data.stack = opts.error.stack;
  }
  if (typeof path === "string") {
    shape.data.path = path;
  }
  return config.errorFormatter({
    ...opts,
    shape
  });
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError.mjs
var UnknownCauseError = class extends Error {
};
function getCauseFromUnknown(cause) {
  if (cause instanceof Error) {
    return cause;
  }
  const type = typeof cause;
  if (type === "undefined" || type === "function" || cause === null) {
    return void 0;
  }
  if (type !== "object") {
    return new Error(String(cause));
  }
  if (isObject(cause)) {
    const err = new UnknownCauseError();
    for (const key in cause) {
      err[key] = cause[key];
    }
    return err;
  }
  return void 0;
}
function getTRPCErrorFromUnknown(cause) {
  if (cause instanceof TRPCError) {
    return cause;
  }
  if (cause instanceof Error && cause.name === "TRPCError") {
    return cause;
  }
  const trpcError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    cause
  });
  if (cause instanceof Error && cause.stack) {
    trpcError.stack = cause.stack;
  }
  return trpcError;
}
var TRPCError = class extends Error {
  constructor(opts) {
    const cause = getCauseFromUnknown(opts.cause);
    const message = opts.message ?? (cause == null ? void 0 : cause.message) ?? opts.code;
    super(message, {
      cause
    });
    this.code = opts.code;
    this.name = "TRPCError";
    if (!this.cause) {
      this.cause = cause;
    }
  }
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/createProxy.mjs
var noop = () => {
};
function createInnerProxy(callback, path) {
  const proxy = new Proxy(noop, {
    get(_obj, key) {
      if (typeof key !== "string" || key === "then") {
        return void 0;
      }
      return createInnerProxy(callback, [
        ...path,
        key
      ]);
    },
    apply(_1, _2, args) {
      const isApply = path[path.length - 1] === "apply";
      return callback({
        args: isApply ? args.length >= 2 ? args[1] : [] : args,
        path: isApply ? path.slice(0, -1) : path
      });
    }
  });
  return proxy;
}
var createRecursiveProxy = (callback) => createInnerProxy(callback, []);
var createFlatProxy = (callback) => {
  return new Proxy(noop, {
    get(_obj, name) {
      if (typeof name !== "string" || name === "then") {
        return void 0;
      }
      return callback(name);
    }
  });
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/formatter.mjs
var defaultFormatter = ({ shape }) => {
  return shape;
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/transformer.mjs
function getDataTransformer(transformer) {
  if ("input" in transformer) {
    return transformer;
  }
  return {
    input: transformer,
    output: transformer
  };
}
var defaultTransformer = {
  input: {
    serialize: (obj) => obj,
    deserialize: (obj) => obj
  },
  output: {
    serialize: (obj) => obj,
    deserialize: (obj) => obj
  }
};
function transformTRPCResponseItem(config, item) {
  if ("error" in item) {
    return {
      ...item,
      error: config.transformer.output.serialize(item.error)
    };
  }
  if ("data" in item.result) {
    return {
      ...item,
      result: {
        ...item.result,
        data: config.transformer.output.serialize(item.result.data)
      }
    };
  }
  return item;
}
function transformTRPCResponse(config, itemOrItems) {
  return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(config, item)) : transformTRPCResponseItem(config, itemOrItems);
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/router.mjs
function isRouter(procedureOrRouter) {
  return procedureOrRouter._def && "router" in procedureOrRouter._def;
}
var emptyRouter = {
  _ctx: null,
  _errorShape: null,
  _meta: null,
  queries: {},
  mutations: {},
  subscriptions: {},
  errorFormatter: defaultFormatter,
  transformer: defaultTransformer
};
var reservedWords = [
  /**
  * Then is a reserved word because otherwise we can't return a promise that returns a Proxy
  * since JS will think that `.then` is something that exists
  */
  "then"
];
function createRouterFactory(config) {
  function createRouterInner(input) {
    const reservedWordsUsed = new Set(Object.keys(input).filter((v) => reservedWords.includes(v)));
    if (reservedWordsUsed.size > 0) {
      throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
    }
    const procedures = omitPrototype({});
    function step(from, path = []) {
      const aggregate = omitPrototype({});
      for (const [key, item] of Object.entries(from ?? {})) {
        if (isRouter(item)) {
          aggregate[key] = step(item._def.record, [
            ...path,
            key
          ]);
          continue;
        }
        if (!isProcedure(item)) {
          aggregate[key] = step(item, [
            ...path,
            key
          ]);
          continue;
        }
        const newPath = [
          ...path,
          key
        ].join(".");
        if (procedures[newPath]) {
          throw new Error(`Duplicate key: ${newPath}`);
        }
        procedures[newPath] = item;
        aggregate[key] = item;
      }
      return aggregate;
    }
    const record = step(input);
    const _def = {
      _config: config,
      router: true,
      procedures,
      ...emptyRouter,
      record
    };
    return {
      ...record,
      _def,
      createCaller(ctx) {
        const proxy = createRecursiveProxy(({ path, args }) => {
          const fullPath = path.join(".");
          const procedure = _def.procedures[fullPath];
          return procedure({
            path: fullPath,
            getRawInput: async () => args[0],
            ctx,
            type: procedure._def.type
          });
        });
        return proxy;
      }
    };
  }
  return createRouterInner;
}
function isProcedure(procedureOrRouter) {
  return typeof procedureOrRouter === "function";
}
function callProcedure(opts) {
  const { type, path } = opts;
  const proc = opts.procedures[path];
  if (!proc || !isProcedure(proc) || proc._def.type !== type) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No "${type}"-procedure on path "${path}"`
    });
  }
  return proc(opts);
}
function createCallerFactory() {
  return function createCallerInner(router2) {
    const _def = router2._def;
    return function createCaller(maybeContext) {
      const proxy = createRecursiveProxy(({ path, args }) => {
        const fullPath = path.join(".");
        const procedure = _def.procedures[fullPath];
        const callProc = (ctx) => procedure({
          path: fullPath,
          getRawInput: async () => args[0],
          ctx,
          type: procedure._def.type
        });
        if (typeof maybeContext === "function") {
          const context = maybeContext();
          if (context instanceof Promise) {
            return context.then(callProc);
          }
          return callProc(context);
        }
        return callProc(maybeContext);
      });
      return proxy;
    };
  };
}
function mergeRouters(...routerList) {
  var _a2;
  const record = mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
  const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
    if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== defaultFormatter) {
      if (currentErrorFormatter !== defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
        throw new Error("You seem to have several error formatters");
      }
      return nextRouter._def._config.errorFormatter;
    }
    return currentErrorFormatter;
  }, defaultFormatter);
  const transformer = routerList.reduce((prev, current) => {
    if (current._def._config.transformer && current._def._config.transformer !== defaultTransformer) {
      if (prev !== defaultTransformer && prev !== current._def._config.transformer) {
        throw new Error("You seem to have several transformers");
      }
      return current._def._config.transformer;
    }
    return prev;
  }, defaultTransformer);
  const router2 = createRouterFactory({
    errorFormatter,
    transformer,
    isDev: routerList.every((r) => r._def._config.isDev),
    allowOutsideOfServer: routerList.every((r) => r._def._config.allowOutsideOfServer),
    isServer: routerList.every((r) => r._def._config.isServer),
    $types: (_a2 = routerList[0]) == null ? void 0 : _a2._def._config.$types
  })(record);
  return router2;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/contentType.mjs
function getRawProcedureInputOrThrow(opts) {
  const { req } = opts;
  try {
    if (req.method === "GET") {
      if (!req.query.has("input")) {
        return void 0;
      }
      const raw = req.query.get("input");
      return JSON.parse(raw);
    }
    if (!opts.preprocessedBody && typeof req.body === "string") {
      return req.body.length === 0 ? void 0 : JSON.parse(req.body);
    }
    return req.body;
  } catch (cause) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      cause
    });
  }
}
var deserializeInputValue = (rawValue, transformer) => {
  return typeof rawValue !== "undefined" ? transformer.input.deserialize(rawValue) : rawValue;
};
var getJsonContentTypeInputs = (opts) => {
  const rawInput = getRawProcedureInputOrThrow(opts);
  const transformer = opts.router._def._config.transformer;
  if (!opts.isBatchCall) {
    return {
      0: deserializeInputValue(rawInput, transformer)
    };
  }
  if (rawInput == null || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: '"input" needs to be an object when doing a batch call'
    });
  }
  const input = {};
  for (const key in rawInput) {
    const k = key;
    const rawValue = rawInput[k];
    const value = deserializeInputValue(rawValue, transformer);
    input[k] = value;
  }
  return input;
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/resolveHTTPResponse.mjs
var HTTP_METHOD_PROCEDURE_TYPE_MAP = {
  GET: "query",
  POST: "mutation"
};
var fallbackContentTypeHandler = {
  getInputs: getJsonContentTypeInputs
};
function initResponse(initOpts) {
  const { ctx, paths, type, responseMeta, untransformedJSON, errors = [] } = initOpts;
  let status = untransformedJSON ? getHTTPStatusCode(untransformedJSON) : 200;
  const headers = {
    "Content-Type": "application/json"
  };
  const eagerGeneration = !untransformedJSON;
  const data = eagerGeneration ? [] : Array.isArray(untransformedJSON) ? untransformedJSON : [
    untransformedJSON
  ];
  const meta = (responseMeta == null ? void 0 : responseMeta({
    ctx,
    paths,
    type,
    data,
    errors,
    eagerGeneration
  })) ?? {};
  for (const [key, value] of Object.entries(meta.headers ?? {})) {
    headers[key] = value;
  }
  if (meta.status) {
    status = meta.status;
  }
  return {
    status,
    headers
  };
}
function caughtErrorToData(cause, errorOpts) {
  const { router: router2, req, onError } = errorOpts.opts;
  const error = getTRPCErrorFromUnknown(cause);
  onError == null ? void 0 : onError({
    error,
    path: errorOpts.path,
    input: errorOpts.input,
    ctx: errorOpts.ctx,
    type: errorOpts.type,
    req
  });
  const untransformedJSON = {
    error: getErrorShape({
      config: router2._def._config,
      error,
      type: errorOpts.type,
      path: errorOpts.path,
      input: errorOpts.input,
      ctx: errorOpts.ctx
    })
  };
  const transformedJSON = transformTRPCResponse(router2._def._config, untransformedJSON);
  const body = JSON.stringify(transformedJSON);
  return {
    error,
    untransformedJSON,
    body
  };
}
async function resolveHTTPResponse(opts) {
  var _a2;
  const { router: router2, req, unstable_onHead, unstable_onChunk } = opts;
  if (req.method === "HEAD") {
    const headResponse = {
      status: 204
    };
    unstable_onHead == null ? void 0 : unstable_onHead(headResponse, false);
    unstable_onChunk == null ? void 0 : unstable_onChunk([
      -1,
      ""
    ]);
    return headResponse;
  }
  const contentTypeHandler = opts.contentTypeHandler ?? fallbackContentTypeHandler;
  const batchingEnabled = ((_a2 = opts.batching) == null ? void 0 : _a2.enabled) ?? true;
  const type = HTTP_METHOD_PROCEDURE_TYPE_MAP[req.method] ?? "unknown";
  let ctx = void 0;
  let paths;
  const isBatchCall = !!req.query.get("batch");
  const isStreamCall = isBatchCall && unstable_onHead && unstable_onChunk && req.headers["trpc-batch-mode"] === "stream";
  try {
    if (opts.error) {
      throw opts.error;
    }
    if (isBatchCall && !batchingEnabled) {
      throw new Error(`Batching is not enabled on the server`);
    }
    if (type === "subscription") {
      throw new TRPCError({
        message: "Subscriptions should use wsLink",
        code: "METHOD_NOT_SUPPORTED"
      });
    }
    if (type === "unknown") {
      throw new TRPCError({
        message: `Unexpected request method ${req.method}`,
        code: "METHOD_NOT_SUPPORTED"
      });
    }
    const inputs = await contentTypeHandler.getInputs({
      isBatchCall,
      req,
      router: router2,
      preprocessedBody: opts.preprocessedBody ?? false
    });
    paths = isBatchCall ? decodeURIComponent(opts.path).split(",") : [
      opts.path
    ];
    const info = {
      isBatchCall,
      calls: paths.map((path, idx) => ({
        path,
        type,
        input: inputs[idx] ?? void 0
      }))
    };
    ctx = await opts.createContext({
      info
    });
    const errors = [];
    const promises = paths.map(async (path, index) => {
      var _a3;
      const input = inputs[index];
      try {
        const data = await callProcedure({
          procedures: opts.router._def.procedures,
          path,
          getRawInput: async () => input,
          ctx,
          type
        });
        return {
          result: {
            data
          }
        };
      } catch (cause) {
        const error = getTRPCErrorFromUnknown(cause);
        errors.push(error);
        (_a3 = opts.onError) == null ? void 0 : _a3.call(opts, {
          error,
          path,
          input,
          ctx,
          type,
          req: opts.req
        });
        return {
          error: getErrorShape({
            config: opts.router._def._config,
            error,
            type,
            path,
            input,
            ctx
          })
        };
      }
    });
    if (!isStreamCall) {
      const untransformedJSON = await Promise.all(promises);
      const headResponse1 = initResponse({
        ctx,
        paths,
        type,
        responseMeta: opts.responseMeta,
        untransformedJSON,
        errors
      });
      unstable_onHead == null ? void 0 : unstable_onHead(headResponse1, false);
      const result = isBatchCall ? untransformedJSON : untransformedJSON[0];
      const transformedJSON = transformTRPCResponse(router2._def._config, result);
      const body = JSON.stringify(transformedJSON);
      unstable_onChunk == null ? void 0 : unstable_onChunk([
        -1,
        body
      ]);
      return {
        status: headResponse1.status,
        headers: headResponse1.headers,
        body
      };
    }
    const headResponse2 = initResponse({
      ctx,
      paths,
      type,
      responseMeta: opts.responseMeta
    });
    unstable_onHead(headResponse2, true);
    const indexedPromises = new Map(promises.map((promise, index) => [
      index,
      promise.then((r) => [
        index,
        r
      ])
    ]));
    for (const _ of paths) {
      const [index, untransformedJSON1] = await Promise.race(indexedPromises.values());
      indexedPromises.delete(index);
      try {
        const transformedJSON1 = transformTRPCResponse(router2._def._config, untransformedJSON1);
        const body1 = JSON.stringify(transformedJSON1);
        unstable_onChunk([
          index,
          body1
        ]);
      } catch (cause) {
        const path = paths[index];
        const input = inputs[index];
        const { body: body2 } = caughtErrorToData(cause, {
          opts,
          ctx,
          type,
          path,
          input
        });
        unstable_onChunk([
          index,
          body2
        ]);
      }
    }
    return;
  } catch (cause1) {
    const { error, untransformedJSON: untransformedJSON2, body: body3 } = caughtErrorToData(cause1, {
      opts,
      ctx,
      type
    });
    const headResponse3 = initResponse({
      ctx,
      paths,
      type,
      responseMeta: opts.responseMeta,
      untransformedJSON: untransformedJSON2,
      errors: [
        error
      ]
    });
    unstable_onHead == null ? void 0 : unstable_onHead(headResponse3, false);
    unstable_onChunk == null ? void 0 : unstable_onChunk([
      -1,
      body3
    ]);
    return {
      status: headResponse3.status,
      headers: headResponse3.headers,
      body: body3
    };
  }
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/batchStreamFormatter.mjs
function getBatchStreamFormatter() {
  let first = true;
  function format(index, string) {
    const prefix = first ? "{" : ",";
    first = false;
    return `${prefix}"${index}":${string}
`;
  }
  format.end = () => "}";
  return format;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/toURL.mjs
function toURL(urlOrPathname) {
  const url = urlOrPathname.startsWith("/") ? `http://127.0.0.1${urlOrPathname}` : urlOrPathname;
  return new URL(url);
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/rootConfig.mjs
var _a, _b, _c, _d, _e, _f;
var isServerDefault = typeof window === "undefined" || "Deno" in window || // eslint-disable-next-line @typescript-eslint/dot-notation
((_b = (_a = globalThis.process) == null ? void 0 : _a.env) == null ? void 0 : _b["NODE_ENV"]) === "test" || !!((_d = (_c = globalThis.process) == null ? void 0 : _c.env) == null ? void 0 : _d["JEST_WORKER_ID"]) || !!((_f = (_e = globalThis.process) == null ? void 0 : _e.env) == null ? void 0 : _f["VITEST_WORKER_ID"]);

// node_modules/@trpc/server/dist/adapters/fetch/fetchRequestHandler.mjs
var trimSlashes = (path) => {
  path = path.startsWith("/") ? path.slice(1) : path;
  path = path.endsWith("/") ? path.slice(0, -1) : path;
  return path;
};
async function fetchRequestHandler(opts) {
  var _a2;
  const resHeaders = new Headers();
  const createContext = async (innerOpts) => {
    var _a3;
    return (_a3 = opts.createContext) == null ? void 0 : _a3.call(opts, {
      req: opts.req,
      resHeaders,
      ...innerOpts
    });
  };
  const url = toURL(opts.req.url);
  const pathname = trimSlashes(url.pathname);
  const endpoint = trimSlashes(opts.endpoint);
  const path = trimSlashes(pathname.slice(endpoint.length));
  const req = {
    query: url.searchParams,
    method: opts.req.method,
    headers: Object.fromEntries(opts.req.headers),
    body: ((_a2 = opts.req.headers.get("content-type")) == null ? void 0 : _a2.startsWith("application/json")) ? await opts.req.text() : ""
  };
  let resolve;
  const promise = new Promise((r) => resolve = r);
  let status = 200;
  let isStream = false;
  let controller;
  let encoder;
  let formatter;
  const unstable_onHead = (head, isStreaming) => {
    for (const [key, value] of Object.entries(head.headers ?? {})) {
      if (typeof value === "undefined") {
        continue;
      }
      if (typeof value === "string") {
        resHeaders.set(key, value);
        continue;
      }
      for (const v of value) {
        resHeaders.append(key, v);
      }
    }
    status = head.status;
    if (isStreaming) {
      resHeaders.set("Transfer-Encoding", "chunked");
      resHeaders.append("Vary", "trpc-batch-mode");
      const stream = new ReadableStream({
        start(c) {
          controller = c;
        }
      });
      const response = new Response(stream, {
        status,
        headers: resHeaders
      });
      resolve(response);
      encoder = new TextEncoder();
      formatter = getBatchStreamFormatter();
      isStream = true;
    }
  };
  const unstable_onChunk = ([index, string]) => {
    if (index === -1) {
      const response = new Response(string || null, {
        status,
        headers: resHeaders
      });
      resolve(response);
    } else {
      controller.enqueue(encoder.encode(formatter(index, string)));
    }
  };
  resolveHTTPResponse({
    req,
    createContext,
    path,
    router: opts.router,
    batching: opts.batching,
    responseMeta: opts.responseMeta,
    onError(o) {
      var _a3;
      (_a3 = opts == null ? void 0 : opts.onError) == null ? void 0 : _a3.call(opts, {
        ...o,
        req: opts.req
      });
    },
    unstable_onHead,
    unstable_onChunk
  }).then(() => {
    if (isStream) {
      controller.enqueue(encoder.encode(formatter.end()));
      controller.close();
    }
  }).catch(() => {
    if (isStream) {
      controller.close();
    }
  });
  return promise;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/middleware.mjs
var middlewareMarker = "middlewareMarker";
function createMiddlewareFactory() {
  function createMiddlewareInner(middlewares) {
    return {
      _middlewares: middlewares,
      unstable_pipe(middlewareBuilderOrFn) {
        const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
          middlewareBuilderOrFn
        ];
        return createMiddlewareInner([
          ...middlewares,
          ...pipedMiddleware
        ]);
      }
    };
  }
  function createMiddleware(fn) {
    return createMiddlewareInner([
      fn
    ]);
  }
  return createMiddleware;
}
function createInputMiddleware(parse) {
  const inputMiddleware = async function inputValidatorMiddleware(opts) {
    let parsedInput;
    const rawInput = await opts.getRawInput();
    try {
      parsedInput = await parse(rawInput);
    } catch (cause) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause
      });
    }
    const combinedInput = isObject(opts.input) && isObject(parsedInput) ? {
      ...opts.input,
      ...parsedInput
    } : parsedInput;
    return opts.next({
      input: combinedInput
    });
  };
  inputMiddleware._type = "input";
  return inputMiddleware;
}
function createOutputMiddleware(parse) {
  const outputMiddleware = async function outputValidatorMiddleware({ next }) {
    const result = await next();
    if (!result.ok) {
      return result;
    }
    try {
      const data = await parse(result.data);
      return {
        ...result,
        data
      };
    } catch (cause) {
      throw new TRPCError({
        message: "Output validation failed",
        code: "INTERNAL_SERVER_ERROR",
        cause
      });
    }
  };
  outputMiddleware._type = "output";
  return outputMiddleware;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/parser.mjs
function getParseFn(procedureParser) {
  const parser = procedureParser;
  if (typeof parser === "function") {
    return parser;
  }
  if (typeof parser.parseAsync === "function") {
    return parser.parseAsync.bind(parser);
  }
  if (typeof parser.parse === "function") {
    return parser.parse.bind(parser);
  }
  if (typeof parser.validateSync === "function") {
    return parser.validateSync.bind(parser);
  }
  if (typeof parser.create === "function") {
    return parser.create.bind(parser);
  }
  if (typeof parser.assert === "function") {
    return (value) => {
      parser.assert(value);
      return value;
    };
  }
  throw new Error("Could not find a validator fn");
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/procedureBuilder.mjs
var unsetMarker = Symbol("unsetMarker");
function createNewBuilder(def1, def2) {
  const { middlewares = [], inputs, meta, ...rest } = def2;
  return createBuilder({
    ...mergeWithoutOverrides(def1, rest),
    inputs: [
      ...def1.inputs,
      ...inputs ?? []
    ],
    middlewares: [
      ...def1.middlewares,
      ...middlewares
    ],
    meta: def1.meta && meta ? {
      ...def1.meta,
      ...meta
    } : meta ?? def1.meta
  });
}
function createBuilder(initDef = {}) {
  const _def = {
    procedure: true,
    inputs: [],
    middlewares: [],
    ...initDef
  };
  const builder = {
    _def,
    input(input) {
      const parser = getParseFn(input);
      return createNewBuilder(_def, {
        inputs: [
          input
        ],
        middlewares: [
          createInputMiddleware(parser)
        ]
      });
    },
    output(output) {
      const parser = getParseFn(output);
      return createNewBuilder(_def, {
        output,
        middlewares: [
          createOutputMiddleware(parser)
        ]
      });
    },
    meta(meta) {
      return createNewBuilder(_def, {
        meta
      });
    },
    use(middlewareBuilderOrFn) {
      const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
        middlewareBuilderOrFn
      ];
      return createNewBuilder(_def, {
        middlewares
      });
    },
    query(resolver) {
      return createResolver({
        ..._def,
        type: "query"
      }, resolver);
    },
    mutation(resolver) {
      return createResolver({
        ..._def,
        type: "mutation"
      }, resolver);
    },
    subscription(resolver) {
      return createResolver({
        ..._def,
        type: "subscription"
      }, resolver);
    }
  };
  return builder;
}
function createResolver(_def, resolver) {
  const finalBuilder = createNewBuilder(_def, {
    resolver,
    middlewares: [
      async function resolveMiddleware(opts) {
        const data = await resolver(opts);
        return {
          marker: middlewareMarker,
          ok: true,
          data,
          ctx: opts.ctx
        };
      }
    ]
  });
  return createProcedureCaller(finalBuilder._def);
}
var codeblock = `
This is a client-only function.
If you want to call this function on the server, see https://trpc.io/docs/v11/server/server-side-calls
`.trim();
function createProcedureCaller(_def) {
  async function procedure(opts) {
    if (!opts || !("getRawInput" in opts)) {
      throw new Error(codeblock);
    }
    async function callRecursive(callOpts = {
      index: 0,
      ctx: opts.ctx
    }) {
      try {
        const middleware = _def.middlewares[callOpts.index];
        const result2 = await middleware({
          ctx: callOpts.ctx,
          type: opts.type,
          path: opts.path,
          getRawInput: callOpts.getRawInput ?? opts.getRawInput,
          meta: _def.meta,
          input: callOpts.input,
          next(_nextOpts) {
            const nextOpts = _nextOpts;
            return callRecursive({
              index: callOpts.index + 1,
              ctx: nextOpts && "ctx" in nextOpts ? {
                ...callOpts.ctx,
                ...nextOpts.ctx
              } : callOpts.ctx,
              input: nextOpts && "input" in nextOpts ? nextOpts.input : callOpts.input,
              getRawInput: nextOpts && "getRawInput" in nextOpts ? nextOpts.getRawInput : callOpts.getRawInput
            });
          }
        });
        return result2;
      } catch (cause) {
        return {
          ok: false,
          error: getTRPCErrorFromUnknown(cause),
          marker: middlewareMarker
        };
      }
    }
    const result = await callRecursive();
    if (!result) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No result from middlewares - did you forget to `return next()`?"
      });
    }
    if (!result.ok) {
      throw result.error;
    }
    return result.data;
  }
  procedure._def = _def;
  return procedure;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/initTRPC.mjs
var TRPCBuilder = class _TRPCBuilder {
  /**
  * Add a context shape as a generic to the root object
  * @link https://trpc.io/docs/v11/server/context
  */
  context() {
    return new _TRPCBuilder();
  }
  /**
  * Add a meta shape as a generic to the root object
  * @link https://trpc.io/docs/v11/quickstart
  */
  meta() {
    return new _TRPCBuilder();
  }
  /**
  * Create the root object
  * @link https://trpc.io/docs/v11/server/routers#initialize-trpc
  */
  create(opts) {
    var _a2, _b2;
    const errorFormatter = (opts == null ? void 0 : opts.errorFormatter) ?? defaultFormatter;
    const transformer = getDataTransformer((opts == null ? void 0 : opts.transformer) ?? defaultTransformer);
    const config = {
      transformer,
      isDev: (opts == null ? void 0 : opts.isDev) ?? // eslint-disable-next-line @typescript-eslint/dot-notation
      ((_b2 = (_a2 = globalThis.process) == null ? void 0 : _a2.env) == null ? void 0 : _b2["NODE_ENV"]) !== "production",
      allowOutsideOfServer: (opts == null ? void 0 : opts.allowOutsideOfServer) ?? false,
      errorFormatter,
      isServer: (opts == null ? void 0 : opts.isServer) ?? isServerDefault,
      /**
      * These are just types, they can't be used at runtime
      * @internal
      */
      $types: createFlatProxy((key) => {
        throw new Error(`Tried to access "$types.${key}" which is not available at runtime`);
      })
    };
    {
      const isServer = (opts == null ? void 0 : opts.isServer) ?? isServerDefault;
      if (!isServer && (opts == null ? void 0 : opts.allowOutsideOfServer) !== true) {
        throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
      }
    }
    return {
      /**
      * Your router config
      * @internal
      */
      _config: config,
      /**
      * Builder object for creating procedures
      * @link https://trpc.io/docs/v11/server/procedures
      */
      procedure: createBuilder({
        meta: opts == null ? void 0 : opts.defaultMeta
      }),
      /**
      * Create reusable middlewares
      * @link https://trpc.io/docs/v11/server/middlewares
      */
      middleware: createMiddlewareFactory(),
      /**
      * Create a router
      * @link https://trpc.io/docs/v11/server/routers
      */
      router: createRouterFactory(config),
      /**
      * Merge Routers
      * @link https://trpc.io/docs/v11/server/merging-routers
      */
      mergeRouters,
      /**
      * Create a server-side caller for a router
      * @link https://trpc.io/docs/v11/server/server-side-calls
      */
      createCallerFactory: createCallerFactory()
    };
  }
};
var initTRPC = new TRPCBuilder();

// src/trpc.ts
var t = initTRPC.context().create();
var router = t.router;
var publicProcedure = t.procedure;
var mergeRouters2 = t.mergeRouters;
var createCallerFactory2 = t.createCallerFactory;

// src/routers/userRouter.ts
var userRouter = router({
  me: publicProcedure.query(async ({ ctx: { user } }) => {
    if (user) {
      return {
        success: true,
        email: user.email,
        emailVerified: user.emailVerified
      };
    }
    return {
      success: false,
      error: "Not authenticated"
    };
  })
});

// src/appRouter.ts
var appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "ok";
  }),
  user: userRouter
});
var export_getEnvAsStr = import_utils7.getEnvAsStr;
export {
  appRouter,
  createCallerFactory2 as createCallerFactory,
  fetchRequestHandler,
  export_getEnvAsStr as getEnvAsStr,
  mergeRouters2 as mergeRouters,
  publicProcedure,
  router
};
/*! Bundled license information:

@trpc/server/dist/unstable-core-do-not-import/http/resolveHTTPResponse.mjs:
  (* istanbul ignore if -- @preserve *)

@trpc/server/dist/adapters/fetch/fetchRequestHandler.mjs:
  (* istanbul ignore if -- @preserve *)
*/
