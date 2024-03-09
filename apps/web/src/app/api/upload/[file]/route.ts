import { decodeAccessToken } from "@/utils/tokenUtils";
import { db, schema, updateAccount } from "@mbsm/db-layer";
import { getEnvAsBool, getEnvAsStr, getErrorMessage } from "@mbsm/utils";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const allowedFile = ["avatar", "post"];
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
const allowedFileSizes = 1024 * 1024 * 5; // 5MB

export async function POST(
  request: Request,
  { params: { file } }: { params: { file: string } }
): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  console.log({ body, file });
  // const log = {
  //   body: {
  //     type: "blob.generate-client-token",
  //     payload: {
  //       pathname: "TG5elKTaKd3iiUL7.png",
  //       callbackUrl: "http://localhost:3000/api/upload/avatar",
  //       clientPayload: null,
  //       multipart: false,
  //     },
  //   },
  //   file: "avatar",
  // };
  // const log = {
  //   type: "blob.upload-completed",
  //   payload: { blob: [Object], tokenPayload: "{}" },
  // };
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
        let token;

        const cookie = request.headers.get("cookie");
        if (cookie) {
          const match = cookie.match(/accessToken=(.*?)(;|$)/);
          if (match) token = decodeAccessToken(match[1]);
        }

        if (!token || !clientPayload) {
          throw new Error("Unauthorized");
        }

        const { id: userId } = token.user;

        const payload = JSON.parse(clientPayload);

        const { handle } = payload;

        const user = await db.query.user.findFirst({
          where: ({ id }, { eq }) => eq(id, userId),
          with: { accounts: true },
        });

        if (!user) throw new Error("User not found");

        const account = user.accounts.find((a) => a.handle === handle);

        if (!account) throw new Error("Account not found");

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            accountId: account.id,
            userId,
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log("blob upload completed", blob, tokenPayload);

        try {
          if (!tokenPayload) throw new Error("No token payload");
          const payload = JSON.parse(tokenPayload);

          const { accountId, userId } = payload;

          if (!accountId || !userId) throw new Error("No account id");

          console.log("writing image");
          const [image] = await db
            .insert(schema.image)
            .values({
              height: 300,
              width: 300,
              hotspot: {
                x: 0.5,
                y: 0.5,
                height: 0.5,
                width: 0.5,
              },
              url: blob.url,
              userId,
            })
            .returning();

          if (!image) throw new Error("Could not insert image");
          console.log("image", image);

          console.log("updating account");
          await updateAccount({
            id: accountId,
            fields: {
              avatarId: image.id,
            },
          });
          console.log("account updated");

          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
