import { z, ZodSchema } from 'zod';

declare const envVariables: readonly ["IS_PROD", "POSTGRES_URL", "POSTGRES_HOST", "POSTGRES_PORT", "POSTGRES_DATABASE", "POSTGRES_USER", "POSTGRES_PASSWORD", "KV_URL", "KV_REST_API_URL", "KV_REST_API_TOKEN", "KV_REST_API_READ_ONLY_TOKEN", "EDGE_CONFIG", "ORIGIN", "RP_NAME", "RP_ID", "SERVER_PROCEDURE_SECRET", "SECRET_ATOKEN", "SECRET_RTOKEN", "RESEND_API_KEY", "DEV_VERIFICATION_CODE", "REUSABLE_INVITE_CODE", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION", "AWS_S3_BUCKET"];
type EnvVariablesType = {
    [K in (typeof envVariables)[number]]: string;
};
type EnvVariablesKeys = keyof EnvVariablesType;

declare const EmailVerificationCodeFormSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
type EmailVerificationCodeForm = z.infer<typeof EmailVerificationCodeFormSchema>;
declare const AccountCreationFormSchema: z.ZodObject<{
    handle: z.ZodString;
}, "strip", z.ZodTypeAny, {
    handle: string;
}, {
    handle: string;
}>;
type AccountCreationForm = z.infer<typeof AccountCreationFormSchema>;

declare const AccountProfileDataSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    links: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title: string;
    }, {
        url: string;
        title: string;
    }>, "many">;
    birthday: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    links: {
        url: string;
        title: string;
    }[];
    name?: string | undefined;
    bio?: string | undefined;
    birthday?: string | undefined;
}, {
    links: {
        url: string;
        title: string;
    }[];
    name?: string | undefined;
    bio?: string | undefined;
    birthday?: string | undefined;
}>;
type AccountProfileData = z.infer<typeof AccountProfileDataSchema>;
declare const UserFacingAccountSchema: z.ZodObject<{
    id: z.ZodString;
    handle: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    profileData: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        links: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            title: string;
        }, {
            url: string;
            title: string;
        }>, "many">;
        birthday: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        links: {
            url: string;
            title: string;
        }[];
        name?: string | undefined;
        bio?: string | undefined;
        birthday?: string | undefined;
    }, {
        links: {
            url: string;
            title: string;
        }[];
        name?: string | undefined;
        bio?: string | undefined;
        birthday?: string | undefined;
    }>>;
    joinedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    handle: string;
    id: string;
    joinedAt: string;
    avatarUrl?: string | undefined;
    profileData?: {
        links: {
            url: string;
            title: string;
        }[];
        name?: string | undefined;
        bio?: string | undefined;
        birthday?: string | undefined;
    } | undefined;
}, {
    handle: string;
    id: string;
    joinedAt: string;
    avatarUrl?: string | undefined;
    profileData?: {
        links: {
            url: string;
            title: string;
        }[];
        name?: string | undefined;
        bio?: string | undefined;
        birthday?: string | undefined;
    } | undefined;
}>;
type UserFacingAccount = z.infer<typeof UserFacingAccountSchema>;

declare const UserFacingAuthenticatorSchema: z.ZodObject<{
    credentialId: z.ZodString;
    name: z.ZodString;
    addedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    credentialId: string;
    addedAt: string;
}, {
    name: string;
    credentialId: string;
    addedAt: string;
}>;
type UserFacingAuthenticator = z.infer<typeof UserFacingAuthenticatorSchema>;

declare const metadataTypes: readonly ["avatar", "post"];
declare const FileMetadataTypeSchema: z.ZodEnum<["avatar", "post"]>;
type FileMetadataType = (typeof metadataTypes)[number];
declare const FileMetadataBaseSchema: z.ZodObject<{
    type: z.ZodEnum<["avatar", "post"]>;
}, "strip", z.ZodTypeAny, {
    type: "avatar" | "post";
}, {
    type: "avatar" | "post";
}>;
declare const AvatarFileMetadataSchema: z.ZodObject<{
    type: z.ZodLiteral<"avatar">;
    accountId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "avatar";
    accountId: string;
}, {
    type: "avatar";
    accountId: string;
}>;
declare const PostFileMetadataSchema: z.ZodObject<{
    type: z.ZodLiteral<"post">;
    postId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "post";
    postId: string;
}, {
    type: "post";
    postId: string;
}>;
declare const FileMetadataSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"avatar">;
    accountId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "avatar";
    accountId: string;
}, {
    type: "avatar";
    accountId: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"post">;
    postId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "post";
    postId: string;
}, {
    type: "post";
    postId: string;
}>]>;
type FileMetadata = z.infer<typeof FileMetadataSchema>;
declare const isFileMetadata: (obj: unknown) => obj is {
    type: "avatar";
    accountId: string;
} | {
    type: "post";
    postId: string;
};
declare const UserFacingFileSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    sizeKB: z.ZodNumber;
    createdAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["avatar", "post"]>;
    }, "strip", z.ZodTypeAny, {
        type: "avatar" | "post";
    }, {
        type: "avatar" | "post";
    }>>;
}, "strip", z.ZodTypeAny, {
    url: string | null;
    id: string;
    sizeKB: number;
    createdAt: string;
    metadata?: {
        type: "avatar" | "post";
    } | undefined;
}, {
    url: string | null;
    id: string;
    sizeKB: number;
    createdAt: string;
    metadata?: {
        type: "avatar" | "post";
    } | undefined;
}>;
type UserFacingFile = z.infer<typeof UserFacingFileSchema>;

declare const UserFacingInviteCodeSchema: z.ZodObject<{
    code: z.ZodString;
    redeemed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    code: string;
    redeemed: boolean;
}, {
    code: string;
    redeemed: boolean;
}>;
type UserFacingInviteCode = z.infer<typeof UserFacingInviteCodeSchema>;

declare const TokenSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        emailVerified: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        emailVerified: boolean;
    }, {
        id: string;
        emailVerified: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        emailVerified: boolean;
    };
}, {
    user: {
        id: string;
        emailVerified: boolean;
    };
}>;
declare const isToken: (value: unknown) => value is {
    user: {
        id: string;
        emailVerified: boolean;
    };
};
type Token = z.infer<typeof TokenSchema>;

declare const userRoles: readonly ["user", "mod", "admin", "foru"];
declare const UserRoleSchema: z.ZodEnum<["user", "mod", "admin", "foru"]>;
type UserRole = z.infer<typeof UserRoleSchema>;
declare const UserFacingUserSchema: z.ZodObject<{
    email: z.ZodString;
    emailVerified: z.ZodBoolean;
    joinedAt: z.ZodString;
    storageLimitMB: z.ZodNumber;
    role: z.ZodEnum<["user", "mod", "admin", "foru"]>;
}, "strip", z.ZodTypeAny, {
    joinedAt: string;
    emailVerified: boolean;
    email: string;
    storageLimitMB: number;
    role: "user" | "mod" | "admin" | "foru";
}, {
    joinedAt: string;
    emailVerified: boolean;
    email: string;
    storageLimitMB: number;
    role: "user" | "mod" | "admin" | "foru";
}>;
type UserFacingUser = z.infer<typeof UserFacingUserSchema>;

declare const getZodTypeGuard: <T extends ZodSchema<any, z.ZodTypeDef, any>>(schema: T) => (value: unknown) => value is z.TypeOf<T>;
declare const getFormattedZodError: (error: z.ZodError) => string;

export { type AccountCreationForm, AccountCreationFormSchema, type AccountProfileData, AccountProfileDataSchema, AvatarFileMetadataSchema, type EmailVerificationCodeForm, EmailVerificationCodeFormSchema, type EnvVariablesKeys, type FileMetadata, FileMetadataBaseSchema, FileMetadataSchema, type FileMetadataType, FileMetadataTypeSchema, PostFileMetadataSchema, type Token, TokenSchema, type UserFacingAccount, UserFacingAccountSchema, type UserFacingAuthenticator, UserFacingAuthenticatorSchema, type UserFacingFile, UserFacingFileSchema, type UserFacingInviteCode, UserFacingInviteCodeSchema, type UserFacingUser, UserFacingUserSchema, type UserRole, UserRoleSchema, getFormattedZodError, getZodTypeGuard, isFileMetadata, isToken, metadataTypes, userRoles };
