"use client";

import { useIsEmailVerified } from "@/components/hooks/useIsEmailVerified";
import { LoadingDots } from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useIsLoggedIn,
  useRegisterMutation,
  useUserQuery,
} from "@/queries/authQueries";
import { getErrorMessage } from "@/utils/stringUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  inviteCode: z
    .string()
    .min(1, "Invite code is required")
    .length(16, "Invite code must be 16 characters long"),
});

const AuthSignupPage = () => {
  const register = useRegisterMutation();
  const user = useUserQuery();
  const router = useRouter();
  const loggedIn = useIsLoggedIn();
  const emailVerified = useIsEmailVerified();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      inviteCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    register.mutate({ email: values.email, inviteCode: values.inviteCode });
  }

  useEffect(() => {
    if (emailVerified === true) {
      router.push("/settings/user");
    } else if (loggedIn) {
      router.push("/auth/verify");
    }
  }, [loggedIn, router, emailVerified]);

  const loading = register.isLoading || user.isLoading || loggedIn;

  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      <Form {...form}>
        <h1 className="text-2xl font-bold mb-4">User Registration</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              disabled={loading}
              className="xs:mr-4 max-xs:mb-2"
            >
              {loading ? <LoadingDots /> : "Sign up"}
            </Button>
            <p className="text-foreground/60 text-sm">
              {`You'll be prompted for a `}
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="link"
                    asChild
                    className="p-0 h-auto text-current hover:text-foreground underline"
                  >
                    <span>passkey.</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Passkeys</DialogTitle>
                    <DialogDescription>
                      Fill with more info later.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </p>
          </div>
        </form>
        {register.isError && (
          <p className="mt-3 self-start text-destructive text-sm inline-flex rounded-md font-medium tracking-wide">
            {getErrorMessage(register.error)}
          </p>
        )}
      </Form>
    </div>
  );
};

export default AuthSignupPage;
