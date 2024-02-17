import { decodeAccessToken } from "@/utils/tokenUtils";
import { redis } from "@mbsm/db-layer";
import type { ErrorResponse } from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "./email";

export const logAndReturnGenericError = (
  err: any,
  errorType?: "unauthorized" | "badRequest" | "internal"
): NextResponse<ErrorResponse> => {
  console.error("Error happened: ", err);

  switch (errorType) {
    case "unauthorized":
      return new NextResponse("Unauthorized", { status: 401 });
    case "badRequest":
      return new NextResponse("Bad Request", { status: 400 });
    case "internal":
      return new NextResponse("Internal Server Error", { status: 500 });
    default:
      return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const IS_SERVER = typeof window === "undefined";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getEmailVerificationCodeForUser = async (userId: number) =>
  redis.get<string | number>(`verification:${userId}`);

export const deleteEmailVerificationCode = async ({
  userId,
}: {
  userId: number;
}) => redis.del(`verification:${userId}`);

export const generateEmailVerificationCodeAndSend = async ({
  userId,
  email,
}: {
  userId: number;
  email: string;
}) => {
  const verificationCode = customAlphabet("0123456789", 6)();

  if (getEnvAsBool("IS_PROD")) {
    await Promise.all([
      redis.set(`verification:${userId}`, verificationCode),
      resend.emails.send({
        from: "noreply@mbsm.io",
        subject: "Verification code for MBSM",
        to: email,
        html: `
        <p>Your verification code is: <b>${verificationCode}</b></p>
        <p>Or click <a href="${getEnvAsStr(
          "ORIGIN"
        )}/verify/${verificationCode}">here</a> to verify your account.</p>
          `,
      }),
    ]);
  }
};

export const authMiddleware = <
  T extends boolean,
  R extends T extends true
    ? { accessToken: string } | NextResponse<ErrorResponse>
    : { accessToken?: string },
>(
  req: NextRequest,
  authRequired?: T
): R => {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) throw new Error("No token found");
    const session = decodeAccessToken(accessToken);
    if (!session) throw new Error("Invalid token");

    return { accessToken } as R;
  } catch (e) {
    if (authRequired) return logAndReturnGenericError(e, "unauthorized") as R;
    return {} as R;
  }
};
