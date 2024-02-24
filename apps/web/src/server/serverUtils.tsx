import VerifyEmail from "@/components/emails/VerifyEmail";
import { decodeAccessToken } from "@/utils/tokenUtils";
import { redis } from "@mbsm/db-layer";
import type { ErrorResponse, Token } from "@mbsm/types";
import { getEnvAsBool } from "@mbsm/utils";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "./email";

export const logAndReturnGenericError = (
  err: any,
  errorType?: "unauthorized" | "badRequest" | "internal" | "notFound"
): NextResponse<ErrorResponse> => {
  console.error("Error happened: ", err);

  switch (errorType) {
    case "unauthorized":
      return new NextResponse("Unauthorized", { status: 401 });
    case "badRequest":
      return new NextResponse("Bad Request", { status: 400 });
    case "internal":
      return new NextResponse("Internal Server Error", { status: 500 });
    case "notFound":
      return new NextResponse("Not Found", { status: 404 });
    default:
      return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const IS_SERVER = typeof window === "undefined";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getEmailVerificationCodeForUser = async (userId: string) =>
  (await redis.get<string | number>(`verification:${userId}`))?.toString() ??
  "";

export const deleteEmailVerificationCode = async ({
  userId,
}: {
  userId: string;
}) => redis.del(`verification:${userId}`);

export const generateEmailVerificationCodeAndSend = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const verificationCode = customAlphabet("0123456789", 6)();

  if (getEnvAsBool("IS_PROD")) {
    await Promise.all([
      redis.set(`verification:${userId}`, verificationCode),
      resend.emails.send({
        from: "noreply@mbsm.io",
        subject: `Your MBSM verification code is ${verificationCode}`,
        to: email,
        react: <VerifyEmail verificationCode={verificationCode} />,
      }),
    ]);
  }
};

export const authMiddleware = <
  T extends boolean,
  R extends T extends true
    ? { accessToken: string; token: Token } | NextResponse<ErrorResponse>
    : { accessToken?: string; token?: Token },
>(
  req: NextRequest,
  authRequired?: T
): R => {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) throw new Error("No token found");
    const token = decodeAccessToken(accessToken);
    if (!token) throw new Error("Invalid token");

    return { accessToken, token } as R;
  } catch (e) {
    if (authRequired) return logAndReturnGenericError(e, "unauthorized") as R;
    return {} as R;
  }
};
