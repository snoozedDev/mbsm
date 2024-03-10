"use client";
import { useAccountSwitcher } from "@/hooks/useAccountSwitcher";
import {
  useCreateAccountMutation,
  useUserMeQuery,
} from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountCreationForm,
  AccountCreationFormSchema,
  UserAccount,
} from "@mbsm/types";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, Settings } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AccountAvatar } from "./account-avatar";
import { FadeFromBelow } from "./containers/fade-from-below";
import { useIsDesktop } from "./hooks/isDesktop";
import { LoadingDots } from "./loading-dots";
import { useModals } from "./modals-layer";
import { CreateAccountModal } from "./modals/CreateAccountModal";
import { ManageAccountModal } from "./modals/ManageAccountModal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
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
        <AccountAvatar account={account} />
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
        <Skeleton className="rounded-full h-10 aspect-square" />
        <Skeleton className="ml-2 rounded-full h-4 w-1/3" />
        <Skeleton className="ml-auto rounded-full h-8 w-16" />
      </div>
    </div>
  );
};

export const UserAccountsPage = () => {
  const { push } = useModals();
  const { isPending, data } = useUserMeQuery();
  const { activeAccount } = useAccountSwitcher();
  const accounts = data?.accounts;
  return (
    <FadeFromBelow>
      {isPending || accounts?.length ? (
        <Card>
          <div className="px-6 py-4">
            <h3 className="text-2xl font-medium tracking-wide mb-4">
              Accounts
            </h3>
            <div className="grid gap-3">
              {isPending
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
              onClick={() => push(({ id }) => <CreateAccountModal id={id} />)}
            >
              Create Account
            </Button>
          </div>
        </Card>
      )}
    </FadeFromBelow>
  );
};

const NewAccountForm = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const form = useForm<AccountCreationForm>({
    resolver: zodResolver(AccountCreationFormSchema),
    mode: "onSubmit",
    defaultValues: {
      handle: "",
    },
  });
  const createAccount = useCreateAccountMutation();

  const { isPending, error, isSuccess } = createAccount;

  useEffect(() => {
    if (error)
      form.setError("handle", {
        message: error.message,
      });
    if (isSuccess) setIsOpen(false);
  }, [error, isSuccess]);

  const onSubmit = (values: AccountCreationForm) => {
    createAccount.mutate(values);
  };

  const renderForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <p className="absolute left-0.5 select-none w-8 text-center text-foreground/75">
                      @
                    </p>
                    <Input
                      disabled={isPending}
                      placeholder="handle"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>This is your account handle.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button
              disabled={isPending}
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Dismiss
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? <LoadingDots /> : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const renderContent = () => {
    const Content = isDesktop ? DialogContent : DrawerContent;
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    // const Description = isDekstop ? DialogDescription : DrawerDescription;

    return (
      <Content
        onFocusOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <Header>
          <Title className="mb-4 text-2xl">Create new account</Title>
          {renderForm()}
        </Header>
      </Content>
    );
  };

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {renderContent()}
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      {renderContent()}
    </Drawer>
  );
};
