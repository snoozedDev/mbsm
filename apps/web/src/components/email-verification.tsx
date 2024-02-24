"use client";
import { FormValues } from "@/components/hooks/forms/formHooksUtils";
import { useVerificationCodeForm } from "@/components/hooks/forms/useVerificationCodeForm";
import { useIsEmailVerified } from "@/components/hooks/useIsEmailVerified";
import { LoadingDots } from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useEmailVerificationMutation,
  useUserMeQuery,
} from "@/queries/userQueries";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const EmailVerification = () => {
  const [emailConcealed, setEmailConcealed] = useState(true);
  const user = useUserMeQuery();
  const router = useRouter();
  const emailVerification = useEmailVerificationMutation();
  const { emailVerified } = useIsEmailVerified();

  const codeForm = useVerificationCodeForm();

  const onSubmit = (values: FormValues<typeof codeForm>) => {
    emailVerification.mutate(values);
  };

  useEffect(() => {
    if (user.isError) {
      router.push("/auth/signup");
    } else if (emailVerified === true) {
      router.push("/settings/user");
    }
  }, [user, router, emailVerified]);

  const loading = emailVerification.isPending || emailVerified !== false;

  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="text-foreground/60 whitespace-pre-line">
          {`We've sent an email to `}
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <button
                  aria-label="
            Toggle email visibility"
                  onClick={() => setEmailConcealed((prev) => !prev)}
                  className="bg-transparent p-0"
                >
                  {emailConcealed ? (
                    <span className="blur-sm">your.email@address.com</span>
                  ) : (
                    user.data?.email ?? ""
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{emailConcealed ? "Reveal" : "Conceal"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {` with a confirmation code. Please check your inbox.
              Once you have the code, enter it below.`}
        </p>
        <Form {...codeForm}>
          <form
            onSubmit={codeForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  {fieldState.error && <FormMessage />}
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {loading ? <LoadingDots /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
