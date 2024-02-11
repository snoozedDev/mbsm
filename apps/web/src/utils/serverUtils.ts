import { NextResponse } from "next/server";

export type SuccessResponse = { success: true };
export type ErrorResponse = { success: false; error: string };
export type ActionResponse<T = undefined> =
  | (SuccessResponse & (T extends undefined ? {} : T))
  | ErrorResponse;

export type ActionResult<T> = T extends (
  ...args: any
) => Promise<NextResponse<infer U>>
  ? U
  : never;
