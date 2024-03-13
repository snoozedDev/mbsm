import {
  UploadClientPayload,
  UploadTokenPayload,
  isUploadTokenPayload,
} from "@/utils/uploadUtils";
import { db, schema, updateAccount, updateFile } from "@mbsm/db-layer";
import { FileMetadata, Token } from "@mbsm/types";
import { PutBlobResult } from "@vercel/blob";
import { HandleUploadOptions } from "@vercel/blob/client";
import { DateTime } from "luxon";

const getTotalFilesSizeKB = (files: (typeof schema.file.$inferSelect)[]) =>
  files.filter((f) => f.uploadedAt).reduce((acc, f) => acc + f.sizeKB, 0);

export const generateFileToken = async ({
  payload,
  token,
}: {
  payload: UploadClientPayload;
  token: Token;
}): ReturnType<HandleUploadOptions["onBeforeGenerateToken"]> => {
  const user = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, token.user.id),
    with: { files: true },
  });

  if (!user) throw new Error("User not found");

  const totalSizeKB = getTotalFilesSizeKB(user.files);
  const totalSizeMB = totalSizeKB / 1024;

  if (user.storageLimitMB < totalSizeMB + payload.fileDetails.sizeKB / 1024) {
    throw new Error("Storage limit exceeded");
  }

  const roundedSizeKB = Math.ceil(payload.fileDetails.sizeKB);

  const [file] = await db
    .insert(schema.file)
    .values({
      sizeKB: roundedSizeKB,
      key: `${payload.type}/${user.id}/${DateTime.utc().toISO()}`,
      userId: user.id,
    })
    .returning();

  if (!file) throw new Error("Could not insert file");

  const tokenPayload: UploadTokenPayload = {
    fileId: file.id,
    clientPayload: payload,
  };

  const allowedContentTypes: string[] = [];

  switch (payload.type) {
    case "avatar":
      allowedContentTypes.push("image/png", "image/jpeg", "image/gif");
      break;
    case "post":
      break;
  }

  return {
    maximumSizeInBytes: roundedSizeKB * 1024,
    tokenPayload: JSON.stringify(tokenPayload),
  };
};

export const handleUploadedFile = async ({
  blob,
  tokenPayload,
}: {
  blob: PutBlobResult;
  tokenPayload: string;
}) => {
  const payload = JSON.parse(tokenPayload);
  if (!isUploadTokenPayload(payload)) throw new Error("Invalid token payload");

  const { fileId, clientPayload } = payload;

  const file = await db.query.file.findFirst({
    where: ({ id }, { eq }) => eq(id, fileId),
    with: { user: true },
  });

  if (!file) throw new Error("File not found");

  const getFileUpdate = (metadata: FileMetadata) =>
    updateFile({
      fields: { uploadedAt: DateTime.utc().toISO(), url: blob.url, metadata },
      id: file.id,
    });

  switch (clientPayload.type) {
    case "avatar":
      await Promise.all([
        getFileUpdate({
          type: "avatar",
          accountId: clientPayload.accountId,
        }),
        updateAccount({
          fields: { avatarId: file.id },
          id: clientPayload.accountId,
        }),
      ]);
      break;

    case "post":
      break;
  }
};
