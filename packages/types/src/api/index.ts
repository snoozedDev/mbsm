import { generateActionResponse } from "./utils";

export * from "./auth";
export * from "./user";

export const EmptyResponseSchema = generateActionResponse({});
