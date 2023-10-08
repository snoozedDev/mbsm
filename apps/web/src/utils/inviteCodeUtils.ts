import { InviteCode } from "@mbsm/types";
import { nanoid } from "nanoid";

export const generateInviteCodes = (count: number): InviteCode[] =>
  Array.from({ length: count }, () => nanoid(16)).map((code) => ({
    code,
    redeemed: false,
  }));
