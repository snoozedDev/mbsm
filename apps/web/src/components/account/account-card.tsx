"use client";
import { UserFacingAccount } from "@mbsm/types";
import { CalendarIcon, LinkIcon, TwitterIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { AccountAvatar } from "../account-avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export const AccountCard = ({ account }: { account: UserFacingAccount }) => {
  return (
    <Card>
      <Link href={`/${account.handle}`}>
        <CardHeader className="space-y-2">
          <AccountAvatar account={account} size="md" />
          <div className="flex flex-col space-y-1">
            <h2 className="text-lg font-medium">{account.profileData?.name}</h2>
            <span className="text-muted-foreground text-xs font-light">
              @{account.handle}
            </span>
          </div>
        </CardHeader>
      </Link>
      {account.profileData?.bio && (
        <CardContent>
          <p>{account.profileData?.bio}</p>
        </CardContent>
      )}
      <CardFooter>
        <ul>
          {account.profileData?.links &&
            account.profileData?.links.map((link, i) => (
              <li className="flex items-center" key={i}>
                {link.title === "twitter" ? (
                  <TwitterIcon className="w-4" />
                ) : (
                  <LinkIcon className="w-4" />
                )}
                <Button asChild variant="link">
                  <Link rel="me" href={link.url}>
                    {link.url}
                  </Link>
                </Button>
              </li>
            ))}
          <li className="flex items-center text-muted-foreground">
            <CalendarIcon className="w-4" />
            <span className="px-4 py-2 text-sm">
              {`joined on ${DateTime.fromISO(account.joinedAt).toFormat(
                "LLL d, yyyy"
              )}`}
            </span>
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
};
