"use client";
import { useAccountSwitcher } from "@/hooks/useAccountSwitcher";
import { useSignedInStatus } from "@/queries/authQueries";
import { useUserMeQuery } from "@/queries/userQueries";
import { UserAccount } from "@mbsm/types";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, Settings } from "lucide-react";
import { Fragment } from "react";
import { AccountAvatar, AvatarPrimitive } from "./account-avatar";
import { useModals } from "./modals-layer";
import { CreateAccountModal } from "./modals/CreateAccountModal";
import { ManageAccountModal } from "./modals/ManageAccountModal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const MotionButton = motion(Button);

const SingleAccount = ({
  account,
  isActive = false,
}: {
  account: UserAccount;
  isActive?: boolean;
}) => {
  const { push } = useModals();
  const { onSwitchActiveAccount } = useAccountSwitcher();

  return (
    <div className="flex">
      <div className="flex-1 flex items-center">
        <AccountAvatar account={account} size="sm" />
        <span className="text-muted-foreground ml-2">
          <span className="text-muted-foreground/40 mr-0.5 select-none">@</span>
          {account.handle}
        </span>
      </div>
      <AnimatePresence>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center select-none text-foreground text-sm px-2"
          >
            <CheckCircleIcon className="h-4" />
            Active
          </motion.div>
        ) : (
          <MotionButton
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => onSwitchActiveAccount(account.handle)}
            variant={"outline"}
          >
            Switch
          </MotionButton>
        )}
      </AnimatePresence>
      <Button
        onClick={() =>
          push(({ id }) => (
            <ManageAccountModal id={id} handle={account.handle} />
          ))
        }
        className="px-3 disabled:p-0 disabled:w-0 disabled:overflow-hidden ml-2"
        variant="outline"
      >
        <Settings />
      </Button>
    </div>
  );
};

const LoadingAccount = () => {
  return (
    <div className="flex">
      <div className="flex-1 flex items-center">
        <AvatarPrimitive alt="" fallback="" loading size="sm" />
        <Skeleton className="ml-2 rounded-full h-4 w-1/3" />
        <Skeleton className="ml-auto rounded-lg h-10 w-12" />
      </div>
    </div>
  );
};

export const UserAccountsPage = () => {
  const { push } = useModals();
  const { isSignedIn } = useSignedInStatus();
  const { isPending, data } = useUserMeQuery();
  const { activeAccount } = useAccountSwitcher();
  const accounts = data?.accounts;
  const isLoading = isPending || !isSignedIn;
  return (
    <div>
      {isLoading || accounts?.length ? (
        <Card>
          <div className="px-6 py-4">
            <h3 className="text-2xl font-medium tracking-wide mb-4">
              Accounts
            </h3>
            <div className="grid gap-3">
              {isLoading
                ? new Array(3).fill(null).map((_, i) => (
                    <Fragment key={i}>
                      <LoadingAccount key={i} />
                      {i !== 2 && <Separator />}
                    </Fragment>
                  ))
                : accounts?.map((account, i) => (
                    <Fragment key={account.handle}>
                      <SingleAccount
                        isActive={account.handle === activeAccount?.handle}
                        {...{ account }}
                      />
                      {i !== accounts.length - 1 && <Separator />}
                    </Fragment>
                  ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 flex flex-row-reverse">
            <Button
              disabled={isPending}
              onClick={() => push(({ id }) => <CreateAccountModal id={id} />)}
            >
              Create Account
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="py-12 px-6 flex flex-col items-center">
            <h3 className="text-xl font-medium tracking-wide">{`You don't have any accounts yet`}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {`You can't post or comment without an account.`}
            </p>
            <Button
              className="mt-4"
              onClick={() => push(({ id }) => <CreateAccountModal id={id} />)}
            >
              Create Account
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
