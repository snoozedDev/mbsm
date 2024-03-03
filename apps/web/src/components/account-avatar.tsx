import { UserAccount } from "@mbsm/types";
import { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const AccountAvatar = forwardRef<
  HTMLSpanElement,
  {
    account: UserAccount;
  } & React.ComponentProps<typeof Avatar>
>(function AccountAvatar({ account, ...props }, ref) {
  return (
    <Avatar ref={ref} {...props}>
      <AvatarImage src={account.avatar?.url} />
      <AvatarFallback>{account.handle[0]}</AvatarFallback>
    </Avatar>
  );
});
