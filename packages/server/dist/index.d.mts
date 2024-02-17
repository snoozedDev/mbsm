import * as _trpc_server_dist_unstable_core_do_not_import from '@trpc/server/dist/unstable-core-do-not-import';
import * as _trpc_server from '@trpc/server';
export { getEnvAsStr } from '@mbsm/utils';
export { fetchRequestHandler } from '@trpc/server/adapters/fetch';

declare const appRouter: _trpc_server_dist_unstable_core_do_not_import.BuiltRouter<{
    ctx: {
        token: {
            user: {
                id: number;
                username: string;
            };
            userAgent: string;
            level: "user" | "admin";
        } | {
            level: "user";
            user: {
                username: any;
                userNanoId: any;
            };
            userAgent: string;
        };
        user: any;
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
                user: {
                    id: number;
                    username: string;
                };
                userAgent: string;
                level: "user" | "admin";
            } | {
                level: "user";
                user: {
                    username: any;
                    userNanoId: any;
                };
                userAgent: string;
            };
            user: any;
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
                email: any;
                emailVerified: any;
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
                user: {
                    id: number;
                    username: string;
                };
                userAgent: string;
                level: "user" | "admin";
            } | {
                level: "user";
                user: {
                    username: any;
                    userNanoId: any;
                };
                userAgent: string;
            };
            user: any;
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
                user: {
                    id: number;
                    username: string;
                };
                userAgent: string;
                level: "user" | "admin";
            } | {
                level: "user";
                user: {
                    username: any;
                    userNanoId: any;
                };
                userAgent: string;
            };
            user: any;
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
        user: {
            id: number;
            username: string;
        };
        userAgent: string;
        level: "user" | "admin";
    } | {
        level: "user";
        user: {
            username: any;
            userNanoId: any;
        };
        userAgent: string;
    };
    user: any;
} | {
    token: null;
    user: null;
}, object, object, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker, typeof _trpc_server_dist_unstable_core_do_not_import.unsetMarker>;
declare const mergeRouters: typeof _trpc_server_dist_unstable_core_do_not_import.mergeRouters;
declare const createCallerFactory: <TRecord extends _trpc_server.TRPCRouterRecord>(router: _trpc_server_dist_unstable_core_do_not_import.Router<{
    ctx: {
        token: {
            user: {
                id: number;
                username: string;
            };
            userAgent: string;
            level: "user" | "admin";
        } | {
            level: "user";
            user: {
                username: any;
                userNanoId: any;
            };
            userAgent: string;
        };
        user: any;
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
            user: {
                id: number;
                username: string;
            };
            userAgent: string;
            level: "user" | "admin";
        } | {
            level: "user";
            user: {
                username: any;
                userNanoId: any;
            };
            userAgent: string;
        };
        user: any;
    } | {
        token: null;
        user: null;
    };
    meta: object;
    errorShape: _trpc_server_dist_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, TRecord>;

export { type AppRouter, appRouter, createCallerFactory, mergeRouters, publicProcedure, router };
