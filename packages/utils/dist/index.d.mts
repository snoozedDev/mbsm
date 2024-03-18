import { EnvVariablesKeys, UserFacingAccount, UserFacingAuthenticator, UserFacingFile, UserFacingInviteCode, UserFacingUser } from '@mbsm/types';
import { DbSchema } from '@mbsm/db-layer';
import { z } from 'zod';

declare const getEnvAsStr: (key: EnvVariablesKeys) => string;
declare const getEnvAsInt: (key: EnvVariablesKeys) => number;
declare const getEnvAsBool: (key: EnvVariablesKeys) => boolean;

declare const toUserFacingAccount: ({ account, avatar, }: {
    account: DbSchema<"account">;
    avatar?: {
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        key: string;
        url: string | null;
        sizeKB: number;
        uploadedAt: string | null;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
    } | null | undefined;
}) => UserFacingAccount;

declare const toUserFacingAuthenticator: ({ authenticator, }: {
    authenticator: DbSchema<"authenticator">;
}) => UserFacingAuthenticator;

declare const toUserFacingFile: ({ file, }: {
    file: DbSchema<"file">;
}) => UserFacingFile;

declare const toUserFacingInviteCode: ({ inviteCode, }: {
    inviteCode: DbSchema<"inviteCode">;
}) => UserFacingInviteCode;

declare const toUserFacingUser: ({ user, }: {
    user: DbSchema<"user">;
}) => UserFacingUser;

declare const snakeToCamel: (str: string) => string;
declare const getErrorMessage: (error: any) => string;

declare const getFormattedZodError: (error: z.ZodError) => string;

export { getEnvAsBool, getEnvAsInt, getEnvAsStr, getErrorMessage, getFormattedZodError, snakeToCamel, toUserFacingAccount, toUserFacingAuthenticator, toUserFacingFile, toUserFacingInviteCode, toUserFacingUser };
