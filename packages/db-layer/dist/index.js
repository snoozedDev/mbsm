"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../utils/dist/index.js
var require_dist = __commonJS({
  "../utils/dist/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
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
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports2 = {};
    __export2(src_exports2, {
      getEnvAsBool: () => getEnvAsBool2,
      getEnvAsInt: () => getEnvAsInt,
      getEnvAsStr: () => getEnvAsStr2,
      getErrorMessage: () => getErrorMessage,
      getFormattedZodError: () => getFormattedZodError,
      snakeToCamel: () => snakeToCamel2
    });
    module2.exports = __toCommonJS2(src_exports2);
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
    var getEnvAsBool2 = (key) => {
      const value = getEnvAsStr2(key);
      if (value === "true")
        return true;
      if (value === "false")
        return false;
      throw new Error(`Environment variable ${key} is not a boolean`);
    };
    var snakeToCamel2 = (str) => str.toLowerCase().replace(
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Ratelimit: () => import_ratelimit.Ratelimit,
  clearCurrentUserChallenge: () => clearCurrentUserChallenge,
  db: () => db,
  getAuthenticatorAndUserByCredentialId: () => getAuthenticatorAndUserByCredentialId,
  getAuthenticatorByCredentialId: () => getAuthenticatorByCredentialId,
  getAuthenticatorsForUser: () => getAuthenticatorsForUser,
  getUnredeemedInviteCode: () => getUnredeemedInviteCode,
  getUserByEmail: () => getUserByEmail,
  getUserById: () => getUserById,
  getUserByNanoId: () => getUserByNanoId,
  getUserInviteCodes: () => getUserInviteCodes,
  insertAccount: () => insertAccount,
  insertAuthenticator: () => insertAuthenticator,
  insertInviteCodes: () => insertInviteCodes,
  insertUser: () => insertUser,
  redis: () => redis,
  schema: () => models_exports,
  updateAuthenticator: () => updateAuthenticator,
  updateInviteCode: () => updateInviteCode,
  updateUser: () => updateUser
});
module.exports = __toCommonJS(src_exports);

// src/db/index.ts
var import_ratelimit = require("@upstash/ratelimit");

// src/db/db.ts
var import_utils7 = __toESM(require_dist());
var import_postgres = require("@vercel/postgres");
var import_postgres_js = require("drizzle-orm/postgres-js");
var import_vercel_postgres = require("drizzle-orm/vercel-postgres");
var import_postgres2 = __toESM(require("postgres"));

// src/db/models/index.ts
var models_exports = {};
__export(models_exports, {
  account: () => account,
  accountRelations: () => accountRelations,
  authenticator: () => authenticator,
  authenticatorRelations: () => authenticatorRelations,
  inviteCode: () => inviteCode,
  inviteCodeRelations: () => inviteCodeRelations,
  roleEnum: () => roleEnum,
  user: () => user,
  userPreferences: () => userPreferences,
  userPreferencesRelations: () => userPreferencesRelations,
  userRelations: () => userRelations
});

// src/db/models/account.ts
var import_drizzle_orm4 = require("drizzle-orm");
var import_pg_core4 = require("drizzle-orm/pg-core");

// src/db/utils.ts
var import_utils = __toESM(require_dist());
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var CURRENT_TIMESTAMP = import_drizzle_orm.sql`CURRENT_TIMESTAMP`;
var getTimestampColumns = () => ({
  deletedAt: (0, import_pg_core.timestamp)("deleted_at"),
  createdAt: (0, import_pg_core.timestamp)("created_at").default(CURRENT_TIMESTAMP).notNull().defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").default(CURRENT_TIMESTAMP).notNull().defaultNow()
});
var getIndexFor = (column, unique) => ({
  [(0, import_utils.snakeToCamel)(column.name)]: (unique ? import_pg_core.uniqueIndex : import_pg_core.index)(
    `${column.uniqueName}_index`
  ).on(column)
});

// src/db/models/user.ts
var import_drizzle_orm3 = require("drizzle-orm");
var import_pg_core3 = require("drizzle-orm/pg-core");

// src/db/models/authenticator.ts
var import_drizzle_orm2 = require("drizzle-orm");
var import_pg_core2 = require("drizzle-orm/pg-core");
var authenticator = (0, import_pg_core2.pgTable)(
  "authenticator",
  {
    id: (0, import_pg_core2.serial)("id").primaryKey(),
    credentialId: (0, import_pg_core2.varchar)("credential_id", { length: 256 }).notNull(),
    credentialPublicKey: (0, import_pg_core2.text)("credential_public_key").notNull(),
    counter: (0, import_pg_core2.integer)("counter").notNull(),
    credentialDeviceType: (0, import_pg_core2.varchar)("credential_device_type", {
      length: 32
    }).notNull(),
    credentialBackedUp: (0, import_pg_core2.boolean)("credential_backed_up").notNull(),
    transports: (0, import_pg_core2.varchar)("transports", { length: 256 }).notNull(),
    name: (0, import_pg_core2.varchar)("name", { length: 64 }).notNull(),
    userId: (0, import_pg_core2.integer)("user_id").references(() => user.id).notNull(),
    ...getTimestampColumns()
  },
  (authenticator2) => ({
    ...getIndexFor(authenticator2.credentialId, true),
    ...getIndexFor(authenticator2.userId)
  })
);
var authenticatorRelations = (0, import_drizzle_orm2.relations)(authenticator, ({ one }) => ({
  user: one(user, {
    fields: [authenticator.userId],
    references: [user.id]
  })
}));

// src/db/models/user.ts
var roleEnum = (0, import_pg_core3.pgEnum)("role", ["user", "mod", "admin", "foru"]);
var user = (0, import_pg_core3.pgTable)(
  "user",
  {
    id: (0, import_pg_core3.serial)("id").primaryKey(),
    nanoId: (0, import_pg_core3.varchar)("nano_id", { length: 12 }).notNull(),
    email: (0, import_pg_core3.varchar)("email", { length: 254 }).notNull(),
    emailVerified: (0, import_pg_core3.boolean)("email_verified").notNull().default(false),
    protected: (0, import_pg_core3.boolean)("protected").notNull().default(false),
    currentRegChallenge: (0, import_pg_core3.varchar)("current_challenge", { length: 256 }),
    role: roleEnum("user").notNull(),
    ...getTimestampColumns()
  },
  (user2) => ({
    ...getIndexFor(user2.nanoId, true),
    ...getIndexFor(user2.email, true)
  })
);
var userRelations = (0, import_drizzle_orm3.relations)(user, ({ one, many }) => ({
  authenticators: many(authenticator)
}));

// src/db/models/account.ts
var account = (0, import_pg_core4.pgTable)(
  "account",
  {
    id: (0, import_pg_core4.serial)("id").primaryKey(),
    userId: (0, import_pg_core4.integer)("user_id").references(() => user.id).notNull(),
    handle: (0, import_pg_core4.varchar)("handle", { length: 16 }).notNull(),
    ...getTimestampColumns()
  },
  (account2) => ({
    ...getIndexFor(account2.handle, true),
    ...getIndexFor(account2.userId)
  })
);
var accountRelations = (0, import_drizzle_orm4.relations)(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));

// src/db/models/inviteCode.ts
var import_drizzle_orm5 = require("drizzle-orm");
var import_pg_core5 = require("drizzle-orm/pg-core");
var inviteCode = (0, import_pg_core5.pgTable)(
  "invite_codes",
  {
    code: (0, import_pg_core5.varchar)("code", { length: 16 }).primaryKey(),
    userId: (0, import_pg_core5.integer)("user_id").references(() => user.id).notNull(),
    redeemed: (0, import_pg_core5.boolean)("redeemed").notNull().default(false)
  },
  (inviteCode2) => ({
    ...getIndexFor(inviteCode2.userId)
  })
);
var inviteCodeRelations = (0, import_drizzle_orm5.relations)(inviteCode, ({ one }) => ({
  user: one(user, {
    fields: [inviteCode.userId],
    references: [user.id]
  })
}));

// src/db/models/userPreferences.ts
var import_drizzle_orm6 = require("drizzle-orm");
var import_pg_core6 = require("drizzle-orm/pg-core");
var userPreferences = (0, import_pg_core6.pgTable)(
  "user_preferences",
  {
    userId: (0, import_pg_core6.integer)("user_id").references(() => user.id).primaryKey(),
    data: (0, import_pg_core6.json)("data").$type().default({ theme: "system", nsfw: "hidden" })
  },
  (userPreferences2) => ({
    ...getIndexFor(userPreferences2.userId, true)
  })
);
var userPreferencesRelations = (0, import_drizzle_orm6.relations)(
  userPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id]
    })
  })
);

// src/db/db.ts
var IS_PROD = (0, import_utils7.getEnvAsBool)("IS_PROD");
var connection = IS_PROD ? import_postgres.sql : (0, import_postgres2.default)((0, import_utils7.getEnvAsStr)("POSTGRES_URL"));
var isVercelConnection = (connection2) => !("END" in connection2);
var db = isVercelConnection(connection) ? (0, import_vercel_postgres.drizzle)(connection, { schema: models_exports }) : (0, import_postgres_js.drizzle)(connection, { schema: models_exports });

// src/db/prepared/account/accountMutations.ts
var insertAccount = async (values) => db.insert(models_exports.account).values(values);

// src/db/prepared/authenticator/authenticatorMutations.ts
var import_drizzle_orm7 = require("drizzle-orm");
var updateAuthenticator = async ({
  id,
  fields
}) => db.update(models_exports.authenticator).set(fields).where((0, import_drizzle_orm7.eq)(models_exports.authenticator.id, id));
var insertAuthenticator = async (fields) => db.insert(models_exports.authenticator).values(fields);

// src/db/prepared/authenticator/authenticatorQueries.ts
var getAuthenticatorsForUser = async (userId) => db.query.authenticator.findMany({
  where: (model, { eq: eq4, and, isNull }) => and(eq4(model.userId, userId), isNull(model.deletedAt))
});
var getAuthenticatorByCredentialId = async (credentialId) => db.query.authenticator.findFirst({
  where: (model, { eq: eq4, and, isNull }) => and(eq4(model.credentialId, credentialId), isNull(model.deletedAt))
});
var getAuthenticatorAndUserByCredentialId = async (credentialId) => db.query.authenticator.findFirst({
  where: (model, { eq: eq4, and, isNull }) => and(eq4(model.credentialId, credentialId), isNull(model.deletedAt)),
  with: {
    user: true
  }
});

// src/db/prepared/inviteCode/inviteCodeMutations.ts
var import_drizzle_orm8 = require("drizzle-orm");
var insertInviteCodes = async ({
  inviteCodes,
  userId
}) => db.insert(models_exports.inviteCode).values(
  inviteCodes.map((input) => ({
    code: input.code,
    redeemed: false,
    userId
  }))
);
var updateInviteCode = async ({
  code,
  fields
}) => db.update(models_exports.inviteCode).set(fields).where((0, import_drizzle_orm8.eq)(models_exports.inviteCode.code, code));

// src/db/prepared/inviteCode/inviteCodeQueries.ts
var getUserInviteCodes = async (userId) => db.query.inviteCode.findMany({
  where: (model, { eq: eq4, and }) => eq4(model.userId, userId)
});
var getUnredeemedInviteCode = async (inviteCode2) => db.query.inviteCode.findFirst({
  where: (model, { eq: eq4, and }) => and(eq4(model.code, inviteCode2), eq4(model.redeemed, false))
});

// src/db/prepared/user/userMutations.ts
var import_drizzle_orm9 = require("drizzle-orm");
var clearCurrentUserChallenge = async (userId) => db.update(models_exports.user).set({ currentRegChallenge: null }).where((0, import_drizzle_orm9.eq)(models_exports.user.id, userId));
var updateUser = async ({
  id,
  fields
}) => db.update(models_exports.user).set(fields).where((0, import_drizzle_orm9.eq)(models_exports.user.id, id));
var insertUser = async (fields) => db.insert(models_exports.user).values(fields);

// src/db/prepared/user/userQueries.ts
var getUserByEmail = async (email) => db.query.user.findFirst({ where: (user2, { eq: eq4 }) => eq4(user2.email, email) });
var getUserById = async (id) => db.query.user.findFirst({ where: (user2, { eq: eq4 }) => eq4(user2.id, id) });
var getUserByNanoId = async (nanoId) => db.query.user.findFirst({ where: (user2, { eq: eq4 }) => eq4(user2.nanoId, nanoId) });

// src/db/redis.ts
var import_kv = require("@vercel/kv");
var redis = import_kv.kv;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Ratelimit,
  clearCurrentUserChallenge,
  db,
  getAuthenticatorAndUserByCredentialId,
  getAuthenticatorByCredentialId,
  getAuthenticatorsForUser,
  getUnredeemedInviteCode,
  getUserByEmail,
  getUserById,
  getUserByNanoId,
  getUserInviteCodes,
  insertAccount,
  insertAuthenticator,
  insertInviteCodes,
  insertUser,
  redis,
  schema,
  updateAuthenticator,
  updateInviteCode,
  updateUser
});
