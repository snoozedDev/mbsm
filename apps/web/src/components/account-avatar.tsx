import { cn } from "@/lib/utils";
import { UserAccount } from "@mbsm/types";
import { ReactNode, forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const AccountAvatar = forwardRef<
  HTMLSpanElement,
  {
    account: UserAccount;
    children?: ReactNode;
  } & React.ComponentProps<typeof Avatar>
>(function AccountAvatar({ account, className, ...props }, ref) {
  return (
    <Avatar ref={ref} className={cn("rounded-lg", className)} {...props}>
      {account.avatar?.url && (
        <AvatarImage
          className="rounded-lg"
          src={account.avatar?.url}
          alt={`@${account.handle}`}
        />
      )}
      {props.children ?? (
        <AvatarFallback className="rounded-lg">
          {account.handle[0]}
        </AvatarFallback>
      )}
    </Avatar>
  );
});
