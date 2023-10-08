import { getZodTypeGuard } from "@/utils/zodUtils";
import { Axios } from "axios";
import { ZodLiteral, ZodSchema, z } from "zod";

const emptyObjectSchema = z.object({});
const okLiteralSchema = z.literal("OK");

export type OkLiteralSchema = typeof okLiteralSchema;

export class ApiRoute<
  M extends "GET" | "POST" = "GET",
  PS extends ZodSchema | undefined = undefined,
  RQB extends M extends "POST" ? ZodSchema : undefined = M extends "POST"
    ? ZodSchema
    : undefined,
  RSB extends ZodSchema | OkLiteralSchema = OkLiteralSchema,
  const R extends string = string
> {
  method: M;
  paramsSchema?: PS;
  requestBodySchema?: RQB;
  responseBodySchema: RSB;
  route: R;

  constructor({
    method = "GET" as M,
    paramsSchema,
    requestBodySchema,
    responseBodySchema = okLiteralSchema as RSB,
    route,
  }: {
    method?: M;
    paramsSchema?: PS;
    requestBodySchema?: RQB;
    responseBodySchema?: RSB;
    route: string;
  }) {
    this.method = method;
    this.paramsSchema = paramsSchema;
    this.responseBodySchema = responseBodySchema;
    this.requestBodySchema = requestBodySchema;
    this.route = route as R;

    this.clientReq = this.clientReq.bind(this);
  }

  validateParams = () =>
    this.paramsSchema
      ? getZodTypeGuard(this.paramsSchema)
      : getZodTypeGuard(emptyObjectSchema);

  validateResponseBody = (): ((
    v: unknown
  ) => v is RSB extends ZodSchema ? z.infer<RSB> : "OK") => {
    return this.responseBodySchema
      ? getZodTypeGuard(this.responseBodySchema)
      : getZodTypeGuard(okLiteralSchema);
  };

  clientReq = ({
    client,
    body,
    params,
  }: { client: Axios } & (PS extends ZodSchema
    ? { params: z.infer<PS> }
    : { params?: undefined }) &
    (M extends "POST"
      ? RQB extends ZodSchema
        ? { body: z.infer<RQB> }
        : { body?: undefined }
      : { body?: undefined })) =>
    this.method === "GET"
      ? client.get<z.infer<RSB>>(this.route, {
          params,
        })
      : client.post<z.infer<RSB>>(this.route, body, {
          params,
        });
}

export const createGetRoute = <
  PS extends ZodSchema | undefined = undefined,
  RSB extends ZodSchema | ZodLiteral<"OK"> = ZodLiteral<"OK">,
  const R extends string = string
>({
  paramsSchema = {} as PS,
  responseBodySchema = okLiteralSchema as RSB,
  route,
}: {
  paramsSchema?: PS;
  responseBodySchema?: RSB;
  route: R;
}) => ({
  paramsSchema,
  responseBodySchema,
  validateParams: (paramsSchema
    ? getZodTypeGuard(paramsSchema)
    : getZodTypeGuard(emptyObjectSchema)) as (
    v: unknown
  ) => v is PS extends ZodSchema ? z.infer<PS> : {},
  validateResponseBody: (responseBodySchema
    ? getZodTypeGuard(responseBodySchema)
    : getZodTypeGuard(okLiteralSchema)) as (v: unknown) => v is z.infer<RSB>,
  get: ({
    client,
    params,
  }: (PS extends ZodSchema
    ? { params: z.infer<PS> }
    : { params?: undefined }) & {
    client: Axios;
  }) =>
    client.get<z.infer<RSB>>(route, {
      params,
    }),
});
