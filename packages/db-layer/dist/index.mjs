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

// ../utils/dist/index.js
var require_dist = __commonJS({
  "../utils/dist/index.js"(exports, module) {
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
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export2(src_exports, {
      getEnvAsBool: () => getEnvAsBool2,
      getEnvAsInt: () => getEnvAsInt,
      getEnvAsStr: () => getEnvAsStr2,
      getErrorMessage: () => getErrorMessage,
      getFormattedZodError: () => getFormattedZodError,
      snakeToCamel: () => snakeToCamel2
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

// src/db/index.ts
import { Ratelimit } from "@upstash/ratelimit";

// src/db/db.ts
var import_utils8 = __toESM(require_dist());
import { sql as vercel } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres";
import postgres from "postgres";

// src/db/models/index.ts
var models_exports = {};
__export(models_exports, {
  account: () => account,
  accountRelations: () => accountRelations,
  authenticator: () => authenticator,
  authenticatorRelations: () => authenticatorRelations,
  file: () => file,
  fileRelations: () => fileRelations,
  inviteCode: () => inviteCode,
  inviteCodeRelations: () => inviteCodeRelations,
  roleEnum: () => roleEnum,
  user: () => user,
  userPreferences: () => userPreferences,
  userPreferencesRelations: () => userPreferencesRelations,
  userRelations: () => userRelations,
  userSchema: () => userSchema
});

// src/db/models/account.ts
import { relations as relations6 } from "drizzle-orm";
import { json as json3, pgTable as pgTable6, uuid as uuid6, varchar as varchar5 } from "drizzle-orm/pg-core";

// src/db/utils.ts
var import_utils = __toESM(require_dist());
import {
  index,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
var getTimestampColumns = () => ({
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow()
});
var getIndexFor = (column, unique) => ({
  [(0, import_utils.snakeToCamel)(column.name)]: (unique ? uniqueIndex : index)(
    `${column.uniqueName}_index`
  ).on(column)
});

// src/db/models/file.ts
import { relations as relations5 } from "drizzle-orm";
import {
  integer as integer3,
  json as json2,
  pgTable as pgTable5,
  timestamp as timestamp2,
  uuid as uuid5,
  varchar as varchar4
} from "drizzle-orm/pg-core";

// src/db/models/user.ts
import { relations as relations4 } from "drizzle-orm";
import {
  boolean as boolean3,
  integer as integer2,
  pgEnum,
  pgTable as pgTable4,
  uuid as uuid4,
  varchar as varchar3
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

// src/db/models/authenticator.ts
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
var authenticator = pgTable(
  "authenticator",
  {
    id: serial("id").primaryKey(),
    credentialId: varchar("credential_id", { length: 256 }).notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: varchar("credential_device_type", {
      length: 32
    }).notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: varchar("transports", { length: 256 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    userId: uuid("user_id").references(() => user.id).notNull(),
    ...getTimestampColumns()
  },
  (authenticator2) => ({
    ...getIndexFor(authenticator2.credentialId, true),
    ...getIndexFor(authenticator2.userId)
  })
);
var authenticatorRelations = relations(authenticator, ({ one }) => ({
  user: one(user, {
    fields: [authenticator.userId],
    references: [user.id]
  })
}));

// src/db/models/inviteCode.ts
import { relations as relations2 } from "drizzle-orm";
import { boolean as boolean2, pgTable as pgTable2, uuid as uuid2, varchar as varchar2 } from "drizzle-orm/pg-core";
var inviteCode = pgTable2(
  "invite_codes",
  {
    code: varchar2("code", { length: 16 }).primaryKey(),
    userId: uuid2("user_id").references(() => user.id).notNull(),
    redeemed: boolean2("redeemed").notNull().default(false)
  },
  (inviteCode2) => ({
    ...getIndexFor(inviteCode2.userId)
  })
);
var inviteCodeRelations = relations2(inviteCode, ({ one }) => ({
  user: one(user, {
    fields: [inviteCode.userId],
    references: [user.id]
  })
}));

// src/db/models/userPreferences.ts
import { relations as relations3 } from "drizzle-orm";
import { json, pgTable as pgTable3, uuid as uuid3 } from "drizzle-orm/pg-core";
var userPreferences = pgTable3(
  "user_preferences",
  {
    userId: uuid3("user_id").references(() => user.id).primaryKey(),
    data: json("data").default({ theme: "system", nsfw: "hidden" })
  },
  (userPreferences2) => ({
    ...getIndexFor(userPreferences2.userId, true)
  })
);
var userPreferencesRelations = relations3(
  userPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id]
    })
  })
);

// src/db/models/user.ts
var roleEnum = pgEnum("role", ["user", "mod", "admin", "foru"]);
var user = pgTable4(
  "user",
  {
    id: uuid4("id").defaultRandom().primaryKey(),
    email: varchar3("email", { length: 254 }).notNull(),
    emailVerified: boolean3("email_verified").notNull().default(false),
    protected: boolean3("protected").notNull().default(false),
    storageLimitMB: integer2("storage_limit_MB").notNull().default(
      1024
      // 1GB
    ),
    currentRegChallenge: varchar3("current_challenge", { length: 256 }),
    role: roleEnum("user").notNull(),
    ...getTimestampColumns()
  },
  (user2) => ({
    ...getIndexFor(user2.email, true)
  })
);
var userRelations = relations4(user, ({ one, many }) => ({
  authenticators: many(authenticator),
  inviteCodes: many(inviteCode),
  accounts: many(account),
  files: many(file),
  preferences: one(userPreferences, {
    fields: [user.id],
    references: [userPreferences.userId]
  })
}));
var userSchema = createSelectSchema(user);

// src/db/models/file.ts
var file = pgTable5(
  "file",
  {
    id: uuid5("id").defaultRandom().primaryKey(),
    userId: uuid5("user_id").references(() => user.id).notNull(),
    key: varchar4("key", { length: 256 }).notNull(),
    url: varchar4("url", { length: 256 }),
    sizeKB: integer3("size_kb").notNull(),
    uploadedAt: timestamp2("uploaded_at", { mode: "string" }),
    metadata: json2("metadata").$type(),
    ...getTimestampColumns()
  },
  (file2) => ({
    ...getIndexFor(file2.userId)
  })
);
var fileRelations = relations5(file, ({ one }) => ({
  user: one(user, {
    fields: [file.userId],
    references: [user.id]
  })
}));

// src/db/models/account.ts
var account = pgTable6(
  "account",
  {
    id: uuid6("id").defaultRandom().primaryKey(),
    userId: uuid6("user_id").references(() => user.id).notNull(),
    handle: varchar5("handle", { length: 16 }).notNull(),
    profileData: json3("profile_data").$type().notNull().default({ links: [] }),
    avatarId: uuid6("avatar_id").references(() => file.id),
    ...getTimestampColumns()
  },
  (account2) => ({
    ...getIndexFor(account2.handle),
    ...getIndexFor(account2.userId),
    ...getIndexFor(account2.deletedAt)
  })
);
var accountRelations = relations6(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  }),
  avatar: one(file, {
    fields: [account.avatarId],
    references: [file.id]
  })
}));

// src/db/db.ts
var IS_PROD = (0, import_utils8.getEnvAsBool)("IS_PROD");
var connection = IS_PROD ? vercel : postgres((0, import_utils8.getEnvAsStr)("POSTGRES_URL"));
var isVercelConnection = (connection2) => !("END" in connection2);
var db = isVercelConnection(connection) ? vercelDrizzle(connection, { schema: models_exports }) : pgDrizzle(connection, { schema: models_exports });

// src/db/prepared/account/accountMutations.ts
import { eq } from "drizzle-orm";
var insertAccount = async (values) => db.insert(models_exports.account).values(values);
var updateAccount = async ({
  id,
  fields
}) => db.update(models_exports.account).set(fields).where(eq(models_exports.account.id, id));

// src/db/prepared/account/accountQueries.ts
var getAccountByHandle = async (handle) => db.query.account.findFirst({
  where: (model, { eq: eq6, and, isNull }) => and(eq6(model.handle, handle), isNull(model.deletedAt))
});

// src/db/prepared/authenticator/authenticatorMutations.ts
import { eq as eq2 } from "drizzle-orm";
var updateAuthenticator = async ({
  id,
  fields
}) => db.update(models_exports.authenticator).set(fields).where(eq2(models_exports.authenticator.id, id));
var insertAuthenticator = async (fields) => db.insert(models_exports.authenticator).values(fields);

// src/db/prepared/authenticator/authenticatorQueries.ts
var getAuthenticatorsForUser = async (userId) => db.query.authenticator.findMany({
  where: (model, { eq: eq6, and, isNull }) => and(eq6(model.userId, userId), isNull(model.deletedAt))
});
var getAuthenticatorByCredentialId = async (credentialId) => db.query.authenticator.findFirst({
  where: (model, { eq: eq6, and, isNull }) => and(eq6(model.credentialId, credentialId), isNull(model.deletedAt))
});
var getAuthenticatorAndUserByCredentialId = async (credentialId) => db.query.authenticator.findFirst({
  where: (model, { eq: eq6, and, isNull }) => and(eq6(model.credentialId, credentialId), isNull(model.deletedAt)),
  with: {
    user: true
  }
});

// src/db/prepared/file/fileMutations.ts
import { eq as eq3 } from "drizzle-orm";
var updateFile = async ({
  id,
  fields
}) => db.update(models_exports.file).set(fields).where(eq3(models_exports.file.id, id));

// src/db/prepared/inviteCode/inviteCodeMutations.ts
import { eq as eq4 } from "drizzle-orm";
var insertInviteCodes = async ({
  inviteCodes,
  userId
}) => db.insert(models_exports.inviteCode).values(inviteCodes);
var updateInviteCode = async ({
  code,
  fields
}) => db.update(models_exports.inviteCode).set(fields).where(eq4(models_exports.inviteCode.code, code));

// src/db/prepared/inviteCode/inviteCodeQueries.ts
var getUserInviteCodes = async (userId) => db.query.inviteCode.findMany({
  where: (model, { eq: eq6, and }) => eq6(model.userId, userId)
});
var getUnredeemedInviteCode = async (inviteCode2) => db.query.inviteCode.findFirst({
  where: (model, { eq: eq6, and }) => and(eq6(model.code, inviteCode2), eq6(model.redeemed, false))
});

// src/db/prepared/user/userMutations.ts
import { eq as eq5 } from "drizzle-orm";
var clearCurrentUserChallenge = async (userId) => db.update(models_exports.user).set({ currentRegChallenge: null }).where(eq5(models_exports.user.id, userId));
var updateUser = async ({
  id,
  fields
}) => db.update(models_exports.user).set(fields).where(eq5(models_exports.user.id, id));
var insertUser = async (fields) => db.insert(models_exports.user).values(fields);

// src/db/prepared/user/userQueries.ts
var getUserByEmail = async (email) => db.query.user.findFirst({ where: (user2, { eq: eq6 }) => eq6(user2.email, email) });
var getUserById = async (id) => db.query.user.findFirst({ where: (user2, { eq: eq6 }) => eq6(user2.id, id) });

// src/db/redis.ts
import { kv } from "@vercel/kv";
var redis = kv;
export {
  Ratelimit,
  clearCurrentUserChallenge,
  db,
  getAccountByHandle,
  getAuthenticatorAndUserByCredentialId,
  getAuthenticatorByCredentialId,
  getAuthenticatorsForUser,
  getUnredeemedInviteCode,
  getUserByEmail,
  getUserById,
  getUserInviteCodes,
  insertAccount,
  insertAuthenticator,
  insertInviteCodes,
  insertUser,
  redis,
  models_exports as schema,
  updateAccount,
  updateAuthenticator,
  updateFile,
  updateInviteCode,
  updateUser
};
