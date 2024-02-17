import * as _trpc_server_dist_unstable_core_do_not_import from '@trpc/server/dist/unstable-core-do-not-import';
import * as _trpc_server from '@trpc/server';
export { getEnvAsStr } from '@mbsm/utils';
export { fetchRequestHandler } from '@trpc/server/adapters/fetch';

declare const appRouter: _trpc_server_dist_unstable_core_do_not_import.BuiltRouter<{
    ctx: {
        token: {
            iss: string;
            sub: string;
            aud: string;
        } | {
            level: string;
            user: {
                username: string;
                userNanoId: string;
            };
            userAgent: string;
        };
        user: {
            id: number;
            nanoId: string;
            email: string;
            emailVerified: boolean;
            protected: boolean;
            currentRegChallenge: string | null;
            role: "user" | "mod" | "admin" | "foru";
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } | {
        token: null;
        user: null;
    };
    meta: object;
    errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, _trpc_server_dist_unstable_core_do_not_import.DecorateCreateRouterOptions<{
    healthCheck: _trpc_server_dist_unstable_core_do_not_import.QueryProcedure<{
        input: void;
        output: string;
    }>;
    user: _trpc_server_dist_unstable_core_do_not_import.BuiltRouter<{
        ctx: {
            token: {
                iss: string;
                sub: string;
                aud: string;
            } | {
                level: string;
                user: {
                    username: string;
                    userNanoId: string;
                };
                userAgent: string;
            };
            user: {
                id: number;
                nanoId: string;
                email: string;
                emailVerified: boolean;
                protected: boolean;
                currentRegChallenge: string | null;
                role: "user" | "mod" | "admin" | "foru";
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } | {
            token: null;
            user: null;
        };
        meta: object;
        errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
        transformer: false;
    }, {
        me: _trpc_server_dist_unstable_core_do_not_import.QueryProcedure<{
            input: void;
            output: {
                success: boolean;
                email: string;
                emailVerified: boolean;
                error?: undefined;
            } | {
                success: boolean;
                error: string;
                email?: undefined;
                emailVerified?: undefined;
            };
        }>;
    }>;
}>>;
type AppRouter = typeof appRouter;

declare const router: {
    <TInput extends _trpc_server.TRPCRouterRecord>(input: TInput): _trpc_server_dist_unstable_core_do_not_import.BuiltRouter<{
        ctx: {
            token: {
                iss: string;
                sub: string;
                aud: string;
            } | {
                level: string;
                user: {
                    username: string;
                    userNanoId: string;
                };
                userAgent: string;
            };
            user: {
                id: number;
                nanoId: string;
                email: string;
                emailVerified: boolean;
                protected: boolean;
                currentRegChallenge: string | null;
                role: "user" | "mod" | "admin" | "foru";
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } | {
            token: null;
            user: null;
        };
        meta: object;
        errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
        transformer: false;
    }, TInput>;
    <TInput_1 extends _trpc_server_dist_unstable_core_do_not_import.CreateRouterOptions>(input: TInput_1): _trpc_server_dist_unstable_core_do_not_import.BuiltRouter<{
        ctx: {
            token: {
                iss: string;
                sub: string;
                aud: string;
            } | {
                level: string;
                user: {
                    username: string;
                    userNanoId: string;
                };
                userAgent: string;
            };
            user: {
                id: number;
                nanoId: string;
                email: string;
                emailVerified: boolean;
                protected: boolean;
                currentRegChallenge: string | null;
                role: "user" | "mod" | "admin" | "foru";
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } | {
            token: null;
            user: null;
        };
        meta: object;
        errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
        transformer: false;
    }, _trpc_server_dist_unstable_core_do_not_import.DecorateCreateRouterOptions<TInput_1>>;
};
declare const publicProcedure: _trpc_server_dist_unstable_core_do_not_import.ProcedureBuilder<{
    token: {
        iss: string;
        sub: string;
        aud: string;
    } | {
        level: string;
        user: {
            username: string;
            userNanoId: string;
        };
        userAgent: string;
    };
    user: {
        id: number;
        nanoId: string;
        email: string;
        emailVerified: boolean;
        protected: boolean;
        currentRegChallenge: string | null;
        role: "user" | "mod" | "admin" | "foru";
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} | {
    token: null;
    user: null;
}, object, object, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker>;
declare const mergeRouters: typeof _trpc_server_dist_unstable_core_do_not_import.mergeRouters;
declare const createCallerFactory: <TRecord extends _trpc_server.TRPCRouterRecord>(router: _trpc_server_dist_unstable_core_do_not_import.Router<{
    ctx: {
        token: {
            iss: string;
            sub: string;
            aud: string;
        } | {
            level: string;
            user: {
                username: string;
                userNanoId: string;
            };
            userAgent: string;
        };
        user: {
            id: number;
            nanoId: string;
            email: string;
            emailVerified: boolean;
            protected: boolean;
            currentRegChallenge: string | null;
            role: "user" | "mod" | "admin" | "foru";
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } | {
        token: null;
        user: null;
    };
    meta: object;
    errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, TRecord>) => _trpc_server_dist_unstable_core_do_not_import.RouterCaller<{
    ctx: {
        token: {
            iss: string;
            sub: string;
            aud: string;
        } | {
            level: string;
            user: {
                username: string;
                userNanoId: string;
            };
            userAgent: string;
        };
        user: {
            id: number;
            nanoId: string;
            email: string;
            emailVerified: boolean;
            protected: boolean;
            currentRegChallenge: string | null;
            role: "user" | "mod" | "admin" | "foru";
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } | {
        token: null;
        user: null;
    };
    meta: object;
    errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, TRecord>;

export { type AppRouter, appRouter, createCallerFactory, mergeRouters, publicProcedure, router };
