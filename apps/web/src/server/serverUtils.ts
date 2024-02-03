import { ErrorResponse } from "@/app/actions/authActions";
import { redis } from "@mbsm/db-layer";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
import { customAlphabet } from "nanoid";
import { resend } from "./email";

export const logAndReturnGenericError = (
  err: any,
  errorType?: "unauthorized" | "badRequest" | "internal"
): ErrorResponse => {
  console.error("Error happened: ", err);

  switch (errorType) {
    case "unauthorized":
      return {
        success: false,
        error: "Unauthorized",
      };
    case "badRequest":
      return {
        success: false,
        error: "Bad Request",
      };
    case "internal":
      return {
        success: false,
        error: "Internal Server Error",
      };
    default:
      return {
        success: false,
        error: "Unknown Error",
      };
  }
};

export const IS_SERVER = typeof window === "undefined";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getEmailVerificationCode = async ({
  userId,
}: {
  userId: number;
}) => redis.get<string | number>(`verification:${userId}`);

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
