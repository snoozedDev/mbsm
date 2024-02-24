import { appRouter } from "@/server/appRouter";
import { decodeAccessToken } from "@/utils/tokenUtils";
import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";

const handler = (request: Request) =>
  fetchRequestHandler({
    req: request,
    endpoint: "/api",
    router: appRouter,
    createContext: ({ resHeaders, req }: FetchCreateContextFnOptions) => {
      // get accessToken cookie
      let token;

      const cookie = req.headers.get("cookie");
      if (cookie) {
        const match = cookie.match(/accessToken=(.*?)(;|$)/);
        if (match) {
          token = decodeAccessToken(match[1]);
        }
      }

      return {
        token,
        resHeaders,
        req,
      };
    },
  });

export { handler as GET, handler as POST };
