import { z, ZodRawShape, ZodSchema } from 'zod';

declare const GetAuthSignInResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    options: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    success: true;
    options?: any;
}, {
    success: true;
    options?: any;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type GetAuthSignInResponse = z.infer<typeof GetAuthSignInResponseSchema>;
declare const PostAuthSignInVerifyBodySchema: z.ZodObject<{
    attRes: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    attRes?: any;
}, {
    attRes?: any;
}>;
type PostAuthSignInVerifyBody = z.infer<typeof PostAuthSignInVerifyBodySchema>;
declare const isPostAuthSignInVerifyBody: (value: unknown) => value is {
    attRes?: any;
};
declare const PostAuthSignupResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    options: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    success: true;
    options?: any;
}, {
    success: true;
    options?: any;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type PostAuthSignupResponse = z.infer<typeof PostAuthSignupResponseSchema>;
declare const PostAuthSignupBodySchema: z.ZodObject<{
    email: z.ZodString;
    inviteCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    inviteCode: string;
}, {
    email: string;
    inviteCode: string;
}>;
declare const isPostAuthSignupBody: (value: unknown) => value is {
    email: string;
    inviteCode: string;
};
type PostAuthSignupBody = z.infer<typeof PostAuthSignupBodySchema>;
declare const PostAuthSignupVerifyBodySchema: z.ZodObject<{
    attRes: z.ZodAny;
    email: z.ZodString;
    inviteCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    inviteCode: string;
    attRes?: any;
}, {
    email: string;
    inviteCode: string;
    attRes?: any;
}>;
type PostAuthSignupVerifyBody = z.infer<typeof PostAuthSignupVerifyBodySchema>;
declare const isPostAuthSignupVerifyBody: (value: unknown) => value is {
    email: string;
    inviteCode: string;
    attRes?: any;
};

declare const SuccessResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    success: true;
}, {
    success: true;
}>;
type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
declare const ErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>;
type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
declare const generateActionResponse: <T extends ZodRawShape>(data: T) => z.ZodUnion<[z.ZodObject<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never>, (z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never> extends infer T_3 extends object ? { [k_2 in keyof T_3]: undefined extends z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never>[k_2] ? never : k_2; } : never)[keyof T | Exclude<"success", keyof T>]> extends infer T_2 ? { [k_1 in keyof T_2]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never>, (z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never> extends infer T_3 extends object ? { [k_2 in keyof T_3]: undefined extends z.baseObjectOutputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never>[k_2] ? never : k_2; } : never)[keyof T | Exclude<"success", keyof T>]>[k_1]; } : never, z.baseObjectInputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never> extends infer T_4 ? { [k_3 in keyof T_4]: z.baseObjectInputType<Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T extends infer T_1 ? { [k in keyof T_1]: (Omit<{
    success: z.ZodLiteral<true>;
}, keyof T> & T)[k]; } : never>[k_3]; } : never>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
declare const EmptyResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    success: true;
}, {
    success: true;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type EmptyResponse = z.infer<typeof EmptyResponseSchema>;

declare const GetUserMeResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    email: z.ZodString;
    emailVerified: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    success: true;
    email: string;
    emailVerified: boolean;
}, {
    success: true;
    email: string;
    emailVerified: boolean;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type GetUserMeResponse = z.infer<typeof GetUserMeResponseSchema>;
declare const GetUserSettingsResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    authenticators: z.ZodArray<z.ZodObject<{
        credentialId: z.ZodString;
        name: z.ZodString;
        addedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        credentialId: string;
        name: string;
        addedAt: string;
    }, {
        credentialId: string;
        name: string;
        addedAt: string;
    }>, "many">;
    inviteCodes: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        redeemed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        code: string;
        redeemed: boolean;
    }, {
        code: string;
        redeemed: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    success: true;
    authenticators: {
        credentialId: string;
        name: string;
        addedAt: string;
    }[];
    inviteCodes: {
        code: string;
        redeemed: boolean;
    }[];
}, {
    success: true;
    authenticators: {
        credentialId: string;
        name: string;
        addedAt: string;
    }[];
    inviteCodes: {
        code: string;
        redeemed: boolean;
    }[];
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type GetUserSettingsResponse = z.infer<typeof GetUserSettingsResponseSchema>;
declare const PostUserEmailVerifyBodySchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
type PostUserEmailVerifyBody = z.infer<typeof PostUserEmailVerifyBodySchema>;
declare const GetUserAuthenticatorResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    regOptions: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    success: true;
    regOptions?: any;
}, {
    success: true;
    regOptions?: any;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type GetUserAuthenticatorResponse = z.infer<typeof GetUserAuthenticatorResponseSchema>;
declare const PutUserAuthenticatorResponseSchema: z.ZodUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    authenticator: z.ZodObject<{
        credentialId: z.ZodString;
        name: z.ZodString;
        addedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        credentialId: string;
        name: string;
        addedAt: string;
    }, {
        credentialId: string;
        name: string;
        addedAt: string;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    authenticator: {
        credentialId: string;
        name: string;
        addedAt: string;
    };
}, {
    success: true;
    authenticator: {
        credentialId: string;
        name: string;
        addedAt: string;
    };
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
}, {
    success: false;
    error: string;
}>]>;
type PutUserAuthenticatorResponse = z.infer<typeof PutUserAuthenticatorResponseSchema>;
declare const PatchUserAuthenticatorCredentialIdBodySchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
type PatchUserAuthenticatorCredentialIdBody = z.infer<typeof PatchUserAuthenticatorCredentialIdBodySchema>;
declare const isPatchUserAuthenticatorCredentialIdBody: (value: unknown) => value is {
    name: string;
};

declare const envVariables: readonly ["IS_PROD", "POSTGRES_URL", "POSTGRES_HOST", "POSTGRES_PORT", "POSTGRES_DATABASE", "POSTGRES_USER", "POSTGRES_PASSWORD", "KV_URL", "KV_REST_API_URL", "KV_REST_API_TOKEN", "KV_REST_API_READ_ONLY_TOKEN", "EDGE_CONFIG", "ORIGIN", "RP_NAME", "RP_ID", "SERVER_PROCEDURE_SECRET", "SECRET_ATOKEN", "SECRET_RTOKEN", "RESEND_API_KEY", "DEV_VERIFICATION_CODE", "REUSABLE_INVITE_CODE", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION", "AWS_S3_BUCKET", "NGROK_DOMAIN", "NGROK_AUTHTOKEN"];
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
    bio?: string | undefined;
    birthday?: string | undefined;
}, {
    links: {
        url: string;
        title: string;
    }[];
    bio?: string | undefined;
    birthday?: string | undefined;
}>;
type AccountProfileData = z.infer<typeof AccountProfileDataSchema>;
declare const UserAccountSchema: z.ZodObject<{
    id: z.ZodString;
    avatar: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        metadata: z.ZodNullable<z.ZodUnion<[z.ZodObject<{
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
        }>]>>;
        url: z.ZodNullable<z.ZodString>;
        sizeKB: z.ZodNumber;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }>>;
    handle: z.ZodString;
}, "strip", z.ZodTypeAny, {
    handle: string;
    avatar: {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    } | null;
    id: string;
}, {
    handle: string;
    avatar: {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    } | null;
    id: string;
}>;
type UserAccount = z.infer<typeof UserAccountSchema>;

declare const AuthenticatorSchema: z.ZodObject<{
    credentialId: z.ZodString;
    name: z.ZodString;
    addedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    credentialId: string;
    name: string;
    addedAt: string;
}, {
    credentialId: string;
    name: string;
    addedAt: string;
}>;
type Authenticator = z.infer<typeof AuthenticatorSchema>;
declare const isAuthenticator: (value: unknown) => value is {
    credentialId: string;
    name: string;
    addedAt: string;
};

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
declare const FileSchema: z.ZodObject<{
    id: z.ZodString;
    metadata: z.ZodNullable<z.ZodUnion<[z.ZodObject<{
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
    }>]>>;
    url: z.ZodNullable<z.ZodString>;
    sizeKB: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    metadata: {
        type: "avatar";
        accountId: string;
    } | {
        type: "post";
        postId: string;
    } | null;
    url: string | null;
    sizeKB: number;
    createdAt: string;
}, {
    id: string;
    metadata: {
        type: "avatar";
        accountId: string;
    } | {
        type: "post";
        postId: string;
    } | null;
    url: string | null;
    sizeKB: number;
    createdAt: string;
}>;

declare const InviteCodeSchema: z.ZodObject<{
    code: z.ZodString;
    redeemed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    code: string;
    redeemed: boolean;
}, {
    code: string;
    redeemed: boolean;
}>;
type InviteCode = z.infer<typeof InviteCodeSchema>;
declare const isInviteCode: (value: unknown) => value is {
    code: string;
    redeemed: boolean;
};

declare const PostPrimitiveSchema: z.ZodObject<{
    id: z.ZodString;
    authorId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "atleastone">>;
    postedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}, {
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}>;
declare const ImagePostSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    authorId: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "atleastone">>;
    postedAt: z.ZodString;
    type: z.ZodLiteral<"image">;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        metadata: z.ZodNullable<z.ZodUnion<[z.ZodObject<{
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
        }>]>>;
        url: z.ZodNullable<z.ZodString>;
        sizeKB: z.ZodNumber;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }>, "atleastone">;
}, "strip", z.ZodTypeAny, {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}, {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}>;
declare const TextPostSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    authorId: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "atleastone">>;
    postedAt: z.ZodString;
    type: z.ZodLiteral<"text">;
}, "strip", z.ZodTypeAny, {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}, {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}>;
declare const PostSchema: z.ZodUnion<[z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    authorId: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "atleastone">>;
    postedAt: z.ZodString;
    type: z.ZodLiteral<"image">;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        metadata: z.ZodNullable<z.ZodUnion<[z.ZodObject<{
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
        }>]>>;
        url: z.ZodNullable<z.ZodString>;
        sizeKB: z.ZodNumber;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, {
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }>, "atleastone">;
}, "strip", z.ZodTypeAny, {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}, {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    authorId: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "atleastone">>;
    postedAt: z.ZodString;
    type: z.ZodLiteral<"text">;
}, "strip", z.ZodTypeAny, {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}, {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
}>]>;
type ImagePost = z.infer<typeof ImagePostSchema>;
type TextPost = z.infer<typeof TextPostSchema>;
type Post = z.infer<typeof PostSchema>;
declare const isImagePost: (value: unknown) => value is {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
};
declare const isTextPost: (value: unknown) => value is {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
};
declare const isPost: (value: unknown) => value is {
    type: "image";
    id: string;
    authorId: string;
    postedAt: string;
    images: [{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }, ...{
        id: string;
        metadata: {
            type: "avatar";
            accountId: string;
        } | {
            type: "post";
            postId: string;
        } | null;
        url: string | null;
        sizeKB: number;
        createdAt: string;
    }[]];
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
} | {
    type: "text";
    id: string;
    authorId: string;
    postedAt: string;
    title?: string | undefined;
    body?: string | undefined;
    tags?: [string, ...string[]] | undefined;
};

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

declare const getZodTypeGuard: <T extends ZodSchema<any, z.ZodTypeDef, any>>(schema: T) => (value: unknown) => value is z.TypeOf<T>;
declare const getFormattedZodError: (error: z.ZodError) => string;

export { type AccountCreationForm, AccountCreationFormSchema, type AccountProfileData, AccountProfileDataSchema, type Authenticator, AuthenticatorSchema, AvatarFileMetadataSchema, type EmailVerificationCodeForm, EmailVerificationCodeFormSchema, type EmptyResponse, EmptyResponseSchema, type EnvVariablesKeys, type ErrorResponse, ErrorResponseSchema, type FileMetadata, FileMetadataSchema, FileSchema, type GetAuthSignInResponse, GetAuthSignInResponseSchema, type GetUserAuthenticatorResponse, GetUserAuthenticatorResponseSchema, type GetUserMeResponse, GetUserMeResponseSchema, type GetUserSettingsResponse, GetUserSettingsResponseSchema, type ImagePost, ImagePostSchema, type InviteCode, InviteCodeSchema, type PatchUserAuthenticatorCredentialIdBody, PatchUserAuthenticatorCredentialIdBodySchema, type Post, type PostAuthSignInVerifyBody, PostAuthSignInVerifyBodySchema, type PostAuthSignupBody, PostAuthSignupBodySchema, type PostAuthSignupResponse, PostAuthSignupResponseSchema, type PostAuthSignupVerifyBody, PostAuthSignupVerifyBodySchema, PostFileMetadataSchema, PostPrimitiveSchema, PostSchema, type PostUserEmailVerifyBody, PostUserEmailVerifyBodySchema, type PutUserAuthenticatorResponse, PutUserAuthenticatorResponseSchema, type SuccessResponse, SuccessResponseSchema, type TextPost, TextPostSchema, type Token, TokenSchema, type UserAccount, UserAccountSchema, generateActionResponse, getFormattedZodError, getZodTypeGuard, isAuthenticator, isFileMetadata, isImagePost, isInviteCode, isPatchUserAuthenticatorCredentialIdBody, isPost, isPostAuthSignInVerifyBody, isPostAuthSignupBody, isPostAuthSignupVerifyBody, isTextPost, isToken };
