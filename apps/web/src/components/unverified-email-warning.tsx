"use client";
import { cn } from "@/lib/utils";
import { useSignedInStatus } from "@/queries/authQueries";
import { useEmailVerificationMutation } from "@/queries/userQueries";
import { getErrorMessage } from "@/utils/stringUtils";
import { PostUserEmailVerifyBody } from "@mbsm/types";
import { MailWarning } from "lucide-react";
import { useVerificationCodeForm } from "./hooks/forms/useVerificationCodeForm";
import { useIsEmailVerified } from "./hooks/useIsEmailVerified";
import { LoadingDots } from "./loading-dots";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export const UnverifiedEmailWarning = () => {
  const { isSignedIn } = useSignedInStatus();
  const { emailVerified, isPending } = useIsEmailVerified();

  const emailVerification = useEmailVerificationMutation();
  const codeForm = useVerificationCodeForm();

  const onSubmit = (values: PostUserEmailVerifyBody) => {
    emailVerification.mutate({ code: values.code });
  };

  const submitting = emailVerification.isPending;

  if (isPending || !isSignedIn) return null;

  return emailVerified === false ? (
    <Form {...codeForm}>
      <form onSubmit={codeForm.handleSubmit(onSubmit)}>
        <Card className="p-4 pl-6 relative flex border-warning/50 overflow-hidden bg-warning/5">
          <div className="w-2 self-stretch absolute left-0 top-0 bottom-0 bg-warning/50" />
          <MailWarning className="mr-4 mt-1 w-5 aspect-square text-warning" />
          <div className="flex-1 flex flex-col">
            <h1 className="text-lg font-medium text-warning">
              Your email is unverified
            </h1>
            <p className="mt-2 text-sm text-warning/80">{`Check your inbox for a verification code and 
              enter it here in order to verify your email. You'll 
              experience limited functionality until you do so.`}</p>
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <FormItem className="mt-4 self-start">
                  <FormLabel
                    className={cn(!fieldState.error && "text-warning")}
                  >
                    Confirmation Code
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  {fieldState.error && <FormMessage />}
                </FormItem>
              )}
            />
            <Button
              disabled={submitting}
              type="submit"
              className="self-start mt-4 bg-warning text-warning-foreground"
            >
              {submitting ? <LoadingDots /> : "Submit"}
            </Button>
            {emailVerification.isError && (
              <p className="mt-3 self-start text-destructive text-sm inline-flex rounded-md font-medium tracking-wide">
                {getErrorMessage(emailVerification.error)}
              </p>
            )}
          </div>
        </Card>
      </form>
    </Form>
  ) : null;
};
