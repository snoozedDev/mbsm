export { Ratelimit, RatelimitConfig } from '@upstash/ratelimit';
import * as drizzle_orm from 'drizzle-orm';
export { InferSelectModel } from 'drizzle-orm';
import * as drizzle_orm_postgres_js from 'drizzle-orm/postgres-js';
import * as drizzle_orm_vercel_postgres from 'drizzle-orm/vercel-postgres';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import { PgInsertValue, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import * as zod from 'zod';
import * as postgres from 'postgres';
import * as pg from 'pg';
import * as _vercel_kv from '@vercel/kv';

declare const account: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "account";
    schema: undefined;
    columns: {
        deletedAt: drizzle_orm_pg_core.PgColumn<{
            name: "deleted_at";
            tableName: "account";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "account";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "account";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "account";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "account";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        handle: drizzle_orm_pg_core.PgColumn<{
            name: "handle";
            tableName: "account";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        profileData: drizzle_orm_pg_core.PgColumn<{
            name: "profile_data";
            tableName: "account";
            dataType: "json";
            columnType: "PgJson";
            data: {
                links: {
                    url: string;
                    title: string;
                }[];
                bio?: string | undefined;
                birthday?: string | undefined;
            };
            driverParam: unknown;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        avatarId: drizzle_orm_pg_core.PgColumn<{
            name: "avatar_id";
            tableName: "account";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const accountRelations: drizzle_orm.Relations<"account", {
    user: drizzle_orm.One<"user", true>;
    avatar: drizzle_orm.One<"file", false>;
}>;

declare const authenticator: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "authenticator";
    schema: undefined;
    columns: {
        deletedAt: drizzle_orm_pg_core.PgColumn<{
            name: "deleted_at";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "authenticator";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        credentialId: drizzle_orm_pg_core.PgColumn<{
            name: "credential_id";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        credentialPublicKey: drizzle_orm_pg_core.PgColumn<{
            name: "credential_public_key";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        counter: drizzle_orm_pg_core.PgColumn<{
            name: "counter";
            tableName: "authenticator";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        credentialDeviceType: drizzle_orm_pg_core.PgColumn<{
            name: "credential_device_type";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        credentialBackedUp: drizzle_orm_pg_core.PgColumn<{
            name: "credential_backed_up";
            tableName: "authenticator";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        transports: drizzle_orm_pg_core.PgColumn<{
            name: "transports";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "authenticator";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const authenticatorRelations: drizzle_orm.Relations<"authenticator", {
    user: drizzle_orm.One<"user", true>;
}>;

declare const file: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "file";
    schema: undefined;
    columns: {
        deletedAt: drizzle_orm_pg_core.PgColumn<{
            name: "deleted_at";
            tableName: "file";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "file";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "file";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "file";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "file";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        key: drizzle_orm_pg_core.PgColumn<{
            name: "key";
            tableName: "file";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        url: drizzle_orm_pg_core.PgColumn<{
            name: "url";
            tableName: "file";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        sizeKB: drizzle_orm_pg_core.PgColumn<{
            name: "size_kb";
            tableName: "file";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        uploadedAt: drizzle_orm_pg_core.PgColumn<{
            name: "uploaded_at";
            tableName: "file";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        metadata: drizzle_orm_pg_core.PgColumn<{
            name: "metadata";
            tableName: "file";
            dataType: "json";
            columnType: "PgJson";
            data: {
                type: "avatar";
                accountId: string;
            } | {
                type: "post";
                postId: string;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const fileRelations: drizzle_orm.Relations<"file", {
    user: drizzle_orm.One<"user", true>;
}>;

declare const inviteCode: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "invite_codes";
    schema: undefined;
    columns: {
        code: drizzle_orm_pg_core.PgColumn<{
            name: "code";
            tableName: "invite_codes";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "invite_codes";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        redeemed: drizzle_orm_pg_core.PgColumn<{
            name: "redeemed";
            tableName: "invite_codes";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const inviteCodeRelations: drizzle_orm.Relations<"invite_codes", {
    user: drizzle_orm.One<"user", true>;
}>;

declare const roleEnum: drizzle_orm_pg_core.PgEnum<["user", "mod", "admin", "foru"]>;
declare const user: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "user";
    schema: undefined;
    columns: {
        deletedAt: drizzle_orm_pg_core.PgColumn<{
            name: "deleted_at";
            tableName: "user";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "user";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "user";
            dataType: "string";
            columnType: "PgTimestampString";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "user";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "user";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        emailVerified: drizzle_orm_pg_core.PgColumn<{
            name: "email_verified";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        protected: drizzle_orm_pg_core.PgColumn<{
            name: "protected";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        storageLimitMB: drizzle_orm_pg_core.PgColumn<{
            name: "storage_limit_MB";
            tableName: "user";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        currentRegChallenge: drizzle_orm_pg_core.PgColumn<{
            name: "current_challenge";
            tableName: "user";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        role: drizzle_orm_pg_core.PgColumn<{
            name: "user";
            tableName: "user";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "user" | "mod" | "admin" | "foru";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["user", "mod", "admin", "foru"];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const userRelations: drizzle_orm.Relations<"user", {
    authenticators: drizzle_orm.Many<"authenticator">;
    inviteCodes: drizzle_orm.Many<"invite_codes">;
    accounts: drizzle_orm.Many<"account">;
    files: drizzle_orm.Many<"file">;
    preferences: drizzle_orm.One<"user_preferences", true>;
}>;
declare const userSchema: zod.ZodObject<{
    deletedAt: zod.ZodNullable<zod.ZodString>;
    createdAt: zod.ZodString;
    updatedAt: zod.ZodString;
    id: zod.ZodString;
    email: zod.ZodString;
    emailVerified: zod.ZodBoolean;
    protected: zod.ZodBoolean;
    storageLimitMB: zod.ZodNumber;
    currentRegChallenge: zod.ZodNullable<zod.ZodString>;
    role: zod.ZodEnum<["user", "mod", "admin", "foru"]>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    id: string;
    email: string;
    emailVerified: boolean;
    protected: boolean;
    storageLimitMB: number;
    currentRegChallenge: string | null;
    role: "user" | "mod" | "admin" | "foru";
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    id: string;
    email: string;
    emailVerified: boolean;
    protected: boolean;
    storageLimitMB: number;
    currentRegChallenge: string | null;
    role: "user" | "mod" | "admin" | "foru";
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}>;

declare const userPreferences: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "user_preferences";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "user_preferences";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        data: drizzle_orm_pg_core.PgColumn<{
            name: "data";
            tableName: "user_preferences";
            dataType: "json";
            columnType: "PgJson";
            data: unknown;
            driverParam: unknown;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const userPreferencesRelations: drizzle_orm.Relations<"user_preferences", {
    user: drizzle_orm.One<"user", true>;
}>;

declare const schema_account: typeof account;
declare const schema_accountRelations: typeof accountRelations;
declare const schema_authenticator: typeof authenticator;
declare const schema_authenticatorRelations: typeof authenticatorRelations;
declare const schema_file: typeof file;
declare const schema_fileRelations: typeof fileRelations;
declare const schema_inviteCode: typeof inviteCode;
declare const schema_inviteCodeRelations: typeof inviteCodeRelations;
declare const schema_roleEnum: typeof roleEnum;
declare const schema_user: typeof user;
declare const schema_userPreferences: typeof userPreferences;
declare const schema_userPreferencesRelations: typeof userPreferencesRelations;
declare const schema_userRelations: typeof userRelations;
declare const schema_userSchema: typeof userSchema;
declare namespace schema {
  export { schema_account as account, schema_accountRelations as accountRelations, schema_authenticator as authenticator, schema_authenticatorRelations as authenticatorRelations, schema_file as file, schema_fileRelations as fileRelations, schema_inviteCode as inviteCode, schema_inviteCodeRelations as inviteCodeRelations, schema_roleEnum as roleEnum, schema_user as user, schema_userPreferences as userPreferences, schema_userPreferencesRelations as userPreferencesRelations, schema_userRelations as userRelations, schema_userSchema as userSchema };
}

declare const db: drizzle_orm_vercel_postgres.VercelPgDatabase<typeof schema> | drizzle_orm_postgres_js.PostgresJsDatabase<typeof schema>;

declare const insertAccount: (values: PgInsertValue<typeof account>) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;
declare const updateAccount: ({ id, fields, }: {
    id: string;
    fields: PgUpdateSetSource<typeof account>;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;

declare const getAccountByHandle: (handle: string) => Promise<{
    id: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    handle: string;
    profileData: {
        links: {
            url: string;
            title: string;
        }[];
        bio?: string | undefined;
        birthday?: string | undefined;
    };
    avatarId: string | null;
} | undefined>;

declare const updateAuthenticator: ({ id, fields, }: {
    id: number;
    fields: PgUpdateSetSource<typeof authenticator>;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;
declare const insertAuthenticator: (fields: PgInsertValue<typeof authenticator>) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;

declare const getAuthenticatorsForUser: (userId: string) => Promise<{
    name: string;
    id: number;
    credentialId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
}[]>;
declare const getAuthenticatorByCredentialId: (credentialId: string) => Promise<{
    name: string;
    id: number;
    credentialId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
} | undefined>;
declare const getAuthenticatorAndUserByCredentialId: (credentialId: string) => Promise<{
    name: string;
    id: number;
    credentialId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user: {
        id: string;
        email: string;
        emailVerified: boolean;
        protected: boolean;
        storageLimitMB: number;
        currentRegChallenge: string | null;
        role: "user" | "mod" | "admin" | "foru";
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
    };
} | undefined>;

declare const updateFile: ({ id, fields, }: {
    id: string;
    fields: PgUpdateSetSource<typeof file>;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;

declare const insertInviteCodes: ({ inviteCodes, userId, }: {
    inviteCodes: PgInsertValue<typeof inviteCode>[];
    userId: string;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;
declare const updateInviteCode: ({ code, fields, }: {
    code: string;
    fields: PgUpdateSetSource<typeof inviteCode>;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;

declare const getUserInviteCodes: (userId: string) => Promise<{
    userId: string;
    code: string;
    redeemed: boolean;
}[]>;
declare const getUnredeemedInviteCode: (inviteCode: string) => Promise<{
    userId: string;
    code: string;
    redeemed: boolean;
} | undefined>;

declare const clearCurrentUserChallenge: (userId: string) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;
declare const updateUser: ({ id, fields, }: {
    id: string;
    fields: PgUpdateSetSource<typeof user>;
}) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;
declare const insertUser: (fields: PgInsertValue<typeof user>) => Promise<pg.QueryResult<never> | postgres.RowList<never[]>>;

declare const getUserByEmail: (email: string) => Promise<{
    id: string;
    email: string;
    emailVerified: boolean;
    protected: boolean;
    storageLimitMB: number;
    currentRegChallenge: string | null;
    role: "user" | "mod" | "admin" | "foru";
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
} | undefined>;
declare const getUserById: (id: string) => Promise<{
    id: string;
    email: string;
    emailVerified: boolean;
    protected: boolean;
    storageLimitMB: number;
    currentRegChallenge: string | null;
    role: "user" | "mod" | "admin" | "foru";
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
} | undefined>;

declare const redis: _vercel_kv.VercelKV;

export { clearCurrentUserChallenge, db, getAccountByHandle, getAuthenticatorAndUserByCredentialId, getAuthenticatorByCredentialId, getAuthenticatorsForUser, getUnredeemedInviteCode, getUserByEmail, getUserById, getUserInviteCodes, insertAccount, insertAuthenticator, insertInviteCodes, insertUser, redis, schema, updateAccount, updateAuthenticator, updateFile, updateInviteCode, updateUser };
