import { useCreateAccountMutation } from "@/queries/userQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountCreationForm, AccountCreationFormSchema } from "@mbsm/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingDots } from "../loading-dots";
import { Modal } from "../modal";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const CreateAccountModal = ({ id }: { id: string }) => {
  const [shouldClose, setShouldClose] = useState(false);
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
    if (isSuccess) close();
  }, [error, isSuccess]);

  const onSubmit = (values: AccountCreationForm) => {
    createAccount.mutate(values);
  };

  const close = () => {
    setShouldClose(true);
  };

  return (
    <Modal id={id} shouldClose={shouldClose}>
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
              onClick={close}
            >
              Dismiss
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? <LoadingDots /> : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
