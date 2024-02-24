"use client";
import { cn } from "@/lib/utils";
import { useSignedInStatus } from "@/queries/authQueries";
import { useUserSettingsQuery } from "@/queries/userQueries";
import { InviteCode } from "@mbsm/types";
import { motion } from "framer-motion";
import { AlertTriangle, EyeIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useIsEmailVerified } from "./hooks/useIsEmailVerified";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Code = ({
  loading,
  code,
  redeemed,
}:
  | ({
      loading?: false;
    } & InviteCode)
  | ({
      loading: true;
    } & Partial<InviteCode>)) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedTooltipVisible, setCopiedTooltipVisible] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      const tooltipTimeout = setTimeout(() => {
        setCopiedTooltipVisible(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
        clearTimeout(tooltipTimeout);
      };
    }
  }, [copied]);

  const onCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setCopiedTooltipVisible(true);
  };

  return (
    <div className="flex w-full">
      <div className="flex items-center">
        {loading ? (
          <Skeleton className="h-10 aspect-square mr-2" />
        ) : (
          <Button
            variant="ghost"
            className={cn("p-2 mr-2", redeemed && "opacity-50 touch")}
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <EyeOffIcon className="h-4" />
            ) : (
              <EyeIcon className="h-4" />
            )}
          </Button>
        )}
        <TooltipProvider>
          <Tooltip
            open={loading ? false : copiedTooltipVisible ? true : undefined}
            delayDuration={150}
            disableHoverableContent
          >
            <TooltipTrigger asChild>
              <span>
                {loading ? (
                  <Skeleton className="h-6 flex-1 w-28 rounded-md border border-input" />
                ) : (
                  <button
                    disabled={redeemed}
                    onClick={onCopy}
                    className={cn(
                      "px-2 py-1 text-sm font-mono tracking-[.1rem]",
                      visible
                        ? "bg-muted text-muted-foreground rounded-lg"
                        : "text-foreground",
                      redeemed && "opacity-50 cursor-default"
                    )}
                  >
                    {visible ? code : "•".repeat(code.length)}
                  </button>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>
                {redeemed
                  ? "This code has been redeemed."
                  : copied
                  ? "Copied!"
                  : "Click to copy."}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {redeemed && !loading && (
          <span className="text-sm text-muted-foreground ml-2 tracking-wide">
            [redeemed]
          </span>
        )}
      </div>
    </div>
  );
};

const WarningMessage = ({ message }: { message: string }) => (
  <div className="flex items-center bg-background text-warning border border-warning rounded-lg p-2 font-medium self-start relative pl-4 overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-2 bg-warning" />
    <AlertTriangle className="mr-2 h-6 aspect-square" />
    <p className="text-sm">{message}</p>
  </div>
);

export const UserInviteCodes = () => {
  const { isSignedIn } = useSignedInStatus();
  const { isPending: isEmailVerificationPending, emailVerified } =
    useIsEmailVerified();
  const {
    isLoading: userSettingsLoading,
    data,
    isSuccess,
  } = useUserSettingsQuery();

  const isLoading =
    userSettingsLoading || !isSignedIn || isEmailVerificationPending;

  const renderCodesList = useCallback(() => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex flex-1">
          <Code loading />
        </li>
      ));
    }

    if (!isSuccess) {
      return null;
    }

    return (
      data.inviteCodes
        .sort((a) => (a.redeemed ? 1 : -1))
        .map((inviteCode, i) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            key={inviteCode.code}
            className="flex flex-1"
          >
            <Code {...inviteCode} />
          </motion.li>
        )) || null
    );
  }, [isLoading, data]);

  return (
    <Card className="flex flex-col overflow-hidden py-4 px-6">
      <h3 className="text-2xl font-medium tracking-wide">Invite codes</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Your friends can use these to join.
      </p>
      {emailVerified === false && !isLoading ? (
        <WarningMessage message="You must verify your email before you can have invite codes." />
      ) : (
        <ul className="space-y-2 flex flex-col items-stretch">
          {renderCodesList()}
        </ul>
      )}
    </Card>
  );
};
