import { db } from "../../db";

export const getUserInviteCodes = async (userId: number) =>
  db.query.inviteCode.findMany({
    where: (model, { eq, and }) => eq(model.userId, userId),
  });

export const getUnredeemedInviteCode = async (inviteCode: string) =>
  db.query.inviteCode.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.code, inviteCode), eq(model.redeemed, false)),
  });
