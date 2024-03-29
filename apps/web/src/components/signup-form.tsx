"use client";

import { useSignUpMutation, useSignedInStatus } from "@/queries/authQueries";
import { useUserMeQuery } from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useIsDesktop } from "./hooks/isDesktop";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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

const SignUpFormSchema = z.object({
  email: z.string().email(),
  inviteCode: z
    .string()
    .min(1, "Invite code is required")
    .length(16, "Invite code must be 16 characters long"),
});

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export const SignupForm = ({}) => {
  const {
    requestSignUp,
    isLoading: signUpLoading,
    error,
  } = useSignUpMutation();
  const router = useRouter();
  const user = useUserMeQuery();
  const signedInStatus = useSignedInStatus();
  const isDesktop = useIsDesktop();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      inviteCode: "",
    },
  });

  useEffect(() => {
    if (user.data?.emailVerified === true) {
      router.push("/settings/user");
    } else if (signedInStatus.isSignedIn) {
      router.push("/auth/verify");
    }
  }, [signedInStatus, router, user]);

  const isLoading = signUpLoading || user.isLoading;

  const renderPasskeyDescription = () => (
    <>
      <p>
        {`A Passkey is just another way to authenticate yourself. Just like passwords and
              email confirmations, it's a way to prove that you are who you say you are. For your
              primary Passkey, I recommend using your phone.`}
      </p>
      <br />
      <p>
        You can read more about it in{" "}
        <Button
          asChild
          variant="link"
          className="p-0 h-auto text-current hover:text-foreground underline"
        >
          <Link
            target="_blank"
            href={
              "https://www.keepersecurity.com/resources/glossary/what-is-a-passkey/"
            }
          >
            this Keeper article.
          </Link>
        </Button>
      </p>
    </>
  );

  const renderInviteCodeDialog = () => {
    if (isDesktop) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="p-0 h-auto text-current hover:text-foreground underline"
            >
              <span>passkey.</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Passkey?</DialogTitle>
              <DialogDescription>
                {renderPasskeyDescription()}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="link"
              className="p-0 h-auto text-current hover:text-foreground underline"
            >
              <span>passkey.</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-1/2">
            <DrawerHeader className="my-8 ">
              <DrawerTitle className="mb-4 text-2xl text-center">
                Passkey?
              </DrawerTitle>
              <DrawerDescription className="text-base text-center">
                {renderPasskeyDescription()}
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    }
  };

  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      <Form {...form}>
        <h1 className="text-2xl font-bold mb-4">User Registration</h1>
        <form onSubmit={form.handleSubmit(requestSignUp)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@domain.com" {...field} />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>
                    {`You'll have to confirm it.`}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Invite Code</FormLabel>
                <FormControl>
                  <Input placeholder="01110101 01110111 01110101" {...field} />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>
                    {`Ask a friend for an invite code.`}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <div className="flex max-xs:flex-col xs:items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="xs:mr-4 max-xs:mb-2"
            >
              {`Sign up`}
            </Button>
            <p className="text-foreground/60 text-sm">
              {`You'll be prompted for a `}
              {renderInviteCodeDialog()}
            </p>
          </div>
        </form>
        {error && (
          <p className="mt-3 self-start text-destructive text-sm inline-flex rounded-md font-medium tracking-wide">
            {error}
          </p>
        )}
      </Form>
    </div>
  );
};
