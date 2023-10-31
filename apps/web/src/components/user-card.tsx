"use client";
import { useCurrentNsfwParam } from "@/hooks/useCurrentNsfwParam";
import { User } from "@mbsm/types";
import { CalendarIcon, LinkIcon, TwitterIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export const UserCard = ({ user }: { user: User }) => {
  const nsfwParam = useCurrentNsfwParam();

  return (
    <Card>
      <Link href={`/${user.username}${nsfwParam}`}>
        <CardHeader className="space-y-2">
          <Avatar className="w-12 h-12 rounded-lg mr-4">
            <AvatarImage
              alt={`${user.displayName}' avatar`}
              height={48}
              width={48}
              src={user.avatar.url}
            />
            <AvatarFallback className="rounded-none font-bold text-xl">
              {user.displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <h2 className="text-lg font-medium">{user.displayName}</h2>
            <span className="text-muted-foreground text-xs font-light">
              @{user.username}
            </span>
          </div>
        </CardHeader>
      </Link>
      {user.bio && (
        <CardContent>
          <p>{user.bio}</p>
        </CardContent>
      )}
      <CardFooter>
        <ul>
          {user.links &&
            user.links.map((link, i) => (
              <li className="flex items-center" key={i}>
                {link.name === "twitter" ? (
                  <TwitterIcon className="w-4" />
                ) : (
                  <LinkIcon className="w-4" />
                )}
                <Button asChild variant="link">
                  <Link rel="me" href={link.url}>
                    {link.name}
                  </Link>
                </Button>
              </li>
            ))}
          <li className="flex items-center text-muted-foreground">
            <CalendarIcon className="w-4" />
            <span className="px-4 py-2 text-sm">
              {`joined on ${DateTime.fromISO(user.joinedAt).toFormat(
                "LLL d, yyyy"
              )}`}
            </span>
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
};
