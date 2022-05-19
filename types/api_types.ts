import { accounts, users } from "@prisma/client";
import { IncomingMessage } from "http";
import { mbsmSession } from "./auth_types";

declare module "next" {
  export interface NextApiRequest extends IncomingMessage {
    user: users & {
      account: accounts;
    };
  }
}

interface APIReponseOk<T> {
  success: true;
  data: T;
}

interface APIResponseErr {
  success: false;
  error: string;
}

export type APIResponse<T> = APIReponseOk<T> | APIResponseErr;
