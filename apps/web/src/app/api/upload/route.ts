import { generateFileToken, handleUploadedFile } from "@/server/uploadUtils";
import { decodeAccessToken } from "@/utils/tokenUtils";
import { isUploadClientPayload } from "@/utils/uploadUtils";
import { getEnvAsBool, getEnvAsStr, getErrorMessage } from "@mbsm/utils";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const allowedFile = ["avatar", "post"];
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
const allowedFileSizes = 1024 * 1024 * 5; // 5MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  if (body.type === "blob.generate-client-token" && !getEnvAsBool("IS_PROD")) {
    // Needed for
    body.payload.callbackUrl = body.payload.callbackUrl.replace(
      "http://localhost:3000",
      `https://${getEnvAsStr("NGROK_DOMAIN")}`
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!clientPayload) throw new Error("No client payload");

        const payload = JSON.parse(clientPayload);

        if (!isUploadClientPayload(payload)) {
          throw new Error("Invalid token payload");
        }

        let token;
        const cookie = request.headers.get("cookie");
        if (cookie) {
          const match = cookie.match(/accessToken=(.*?)(;|$)/);
          if (match) token = decodeAccessToken(match[1]);
        }

        if (!token) throw new Error("Unauthorized");

        try {
          return await generateFileToken({ payload, token });
        } catch (e) {
          throw new Error(
            "Very bad error in file token generation fn:" +
              JSON.stringify({ payload, token }),
            {
              cause: e,
            }
          );
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          if (!tokenPayload) throw new Error("No token payload");
          await handleUploadedFile({ blob, tokenPayload });
        } catch (error) {
          throw new Error(
            "Very bad error in file upload callback:" +
              JSON.stringify({ blob, tokenPayload }),
            {
              cause: error,
            }
          );
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
