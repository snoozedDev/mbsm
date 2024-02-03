"use client";
import { FadeFromBelow } from "../containers/fade-from-below";
import { UserInviteCodes } from "../user-invite-codes";

export const UserSettingsPage = () => {
  return (
    <FadeFromBelow>
      <UserInviteCodes />
    </FadeFromBelow>
  );
};

export default UserSettingsPage;
