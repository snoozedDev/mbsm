"use client";
import { cn } from "@/lib/utils";
import {
  useAddAuthenticatorMutation,
  useUpdateAuthenticatorMutation,
  useUserMeQuery,
  useUserSettingsQuery,
} from "@/queries/userQueries";
import { Authenticator } from "@mbsm/types";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { DateTime } from "luxon";
import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FadeFromBelow } from "./containers/fade-from-below";
import { LoadingDots } from "./loading-dots";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const SingleAuthenticatorSkeleton = () => (
  <div className="flex space-x-2 w-full my-4 sm:my-4">
    <div className="flex-1 px-2 flex max-sm:flex-col sm:space-x-4 sm:items-center sm:my-0.5">
      <div className="flex-1 flex">
        <Skeleton className="h-6 w-4/12 mr-auto" />
        <Skeleton className="h-6 w-1/12 sm:w-3/12" />
      </div>
      <Skeleton className="h-6 w-4/12 sm:w-1/12 max-sm:mt-6 max-sm:self-end" />
    </div>
  </div>
);

const SingleAuthenticator = ({
  authenticator,
}: {
  authenticator: Authenticator;
}) => {
  const { data } = useUserSettingsQuery();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateName, isPending } = useUpdateAuthenticatorMutation();

  useEffect(() => {
    if (authenticator) setName(authenticator.name);
  }, [authenticator]);

  const onSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      setEditing(false);
      if (name !== authenticator.name)
        updateName({ name, credentialId: authenticator.credentialId });
    },
    [authenticator, name, updateName]
  );

  useEffect(() => {
    if (editing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [editing, inputRef]);

  const onDelete = useCallback(() => {}, []);

  if (!data) return null;

  const canDelete = (data?.authenticators ?? []).length > 1;

  const onEdit = () => {
    setEditing((v) => !v);
  };

  const isMutating = isPending;

  const dateTime = authenticator
    ? DateTime.fromISO(authenticator?.addedAt)
    : undefined;
  // if less than 1 minute, show "just now"
  const relativeTime = dateTime
    ? dateTime.diffNow().as("minutes") > -1
      ? "just now"
      : dateTime.toRelative()
    : undefined;

  return (
    <div className="flex space-x-2 w-full my-1 relative">
      <form
        onSubmit={onSubmit}
        className="flex flex-1 justify-between items-stretch flex-col sm:flex-row sm:items-center relative"
      >
        <div className="flex-1 flex">
          <input
            aria-label="Authenticator name"
            type="text"
            ref={inputRef}
            value={name}
            readOnly={!editing}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "flex-1 py-2 my-2 px-2 rounded-lg text-sm text-foreground font-medium max-sm:text-base overflow-ellipsis whitespace-nowrap",
              editing ? "bg-muted" : "bg-background outline-none"
            )}
          />
          <LoadingDots className={cn("mr-4 my-4 ", !isMutating && "hidden")} />
        </div>
        <div
          className={cn(
            "flex justify-end max-sm:mb-1 sm:ml-2 space-x-2",
            !editing && "hidden"
          )}
        >
          <Button
            disabled={!editing}
            variant="secondary"
            className={cn("h-9 text-sm hover:cursor-pointer")}
            onClick={() => {}}
          >
            Cancel
          </Button>
          <input
            type="submit"
            disabled={!editing}
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "h-9 text-sm hover:cursor-pointer"
            )}
            value="Save"
          />
        </div>
        <span
          className={cn(
            "text-sm text-muted-foreground mx-2 min-w-max max-sm:text-right max-sm:my-2 max-sm:mt-3",
            (editing || isMutating) && "hidden"
          )}
        >
          Added {relativeTime}
        </span>

        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={editing || isMutating}
                className="px-3 max-sm:absolute top-0 right-0 disabled:p-0 disabled:w-0 disabled:overflow-hidden"
                variant="link"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="flex flex-col items-stretch"
            >
              <DropdownMenuItem asChild>
                <Button
                  onClick={onEdit}
                  variant="ghost"
                  className={cn("hover:cursor-pointer justify-start")}
                >
                  Edit name
                </Button>
              </DropdownMenuItem>
              {canDelete && (
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem asChild>
                    <Button
                      disabled={!canDelete}
                      variant="ghost"
                      className={cn(
                        "hover:cursor-pointer disabled:hover:cursor-default justify-start"
                      )}
                    >
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {canDelete
                  ? "Are you sure?"
                  : "You can't delete your last authenticator."}
              </AlertDialogTitle>
              <AlertDialogDescription>
                The following authenticator will be deleted and you will not be
                able to log in with it anymore.
              </AlertDialogDescription>
              <ul className="self-start">
                <li className="text-base py-2 list-disc list-inside">
                  {authenticator.name}
                </li>
              </ul>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
};

export const UserPasskeys = () => {
  const { isPending: isUserMePending } = useUserMeQuery();
  const { isPending: isUserSettingsPending, data } = useUserSettingsQuery();
  const {
    isLoading: addingAuthenticator,
    requestAddAuthenticator: addAuthenticator,
  } = useAddAuthenticatorMutation();

  const isPending = isUserMePending || isUserSettingsPending;

  return (
    <FadeFromBelow>
      <Card className="overflow-hidden">
        <div className="py-4 px-6">
          <h3 className="text-2xl font-medium tracking-wide">Passkeys</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            These are individual passkeys that you have set up for your
            accounts.
          </p>
          <ul className="flex flex-col items-stretch">
            {isPending
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Fragment key={i}>
                    <li key={i} className="flex flex-1">
                      <SingleAuthenticatorSkeleton />
                    </li>
                    {i !== 2 && <Separator />}
                  </Fragment>
                ))
              : data
              ? data.authenticators
                  .sort(
                    (a, b) =>
                      DateTime.fromISO(b.addedAt).toMillis() -
                      DateTime.fromISO(a.addedAt).toMillis()
                  )
                  .map((authenticator, i) => (
                    <Fragment key={authenticator.credentialId}>
                      <motion.li
                        key={authenticator.credentialId}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex flex-1"
                      >
                        <SingleAuthenticator authenticator={authenticator} />
                      </motion.li>
                      {i !== data.authenticators.length - 1 && <Separator />}
                    </Fragment>
                  ))
              : null}
          </ul>
        </div>

        <div className="bg-muted/50 p-4 flex flex-row-reverse">
          <Button
            disabled={addingAuthenticator || isPending}
            onClick={() => addAuthenticator()}
          >
            {addingAuthenticator ? <LoadingDots /> : "Add New"}
          </Button>
        </div>
      </Card>
    </FadeFromBelow>
  );
};
