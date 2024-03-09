const allowedUploadReasons = ["avatar", "post"] as const;

export type UploadReason = (typeof allowedUploadReasons)[number];

export const isUploadReason = (reason: string): reason is UploadReason =>
  allowedUploadReasons.includes(reason as any);

export type UploadPayload<T extends UploadReason> = T extends "avatar"
  ? { handle: string }
  : {};
