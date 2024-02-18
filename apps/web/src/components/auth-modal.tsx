import { useSignIn } from "@clerk/clerk-react";
import type { OAuthStrategy } from "@clerk/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SiDiscord, SiGoogle } from "react-icons/si";
import { useIsDesktop } from "./hooks/isDesktop";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
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

export enum AuthModalMode {
  SignIn = "SIGN_IN",
  SignUp = "SIGN_UP",
  EmailCode = "EMAIL_CODE",
}

export const AuthModal = ({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: AuthModalMode;
}) => {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [open, setOpen] = useState(false);

  const isDesktop = useIsDesktop();

  const renderHeader = () => {
    const Header = isDesktop ? DialogHeader : DrawerHeader;
    const Title = isDesktop ? DialogTitle : DrawerTitle;
    let title;
    switch (mode) {
      case AuthModalMode.SignIn:
        title = "Sign into your account";
        break;
      case AuthModalMode.SignUp:
        title = "Sign up for an account";
        break;
      case AuthModalMode.EmailCode:
        title = "Verification code";
        break;
    }
    return (
      <Header className="mb-4">
        <Title className="text-2xl">{title}</Title>
      </Header>
    );
  };

  const renderFooter = () => {
    const Footer = isDesktop ? DialogFooter : DrawerFooter;

    switch (mode) {
      case AuthModalMode.SignIn:
        return (
          <Footer>
            <p className="text-sm">
              <Button
                variant={"link"}
                onClick={() => setMode(AuthModalMode.SignUp)}
              >
                Sign up instead.
              </Button>
            </p>
          </Footer>
        );
      default:
        return null;
    }
  };

  const renderMode = () => {
    switch (mode) {
      case AuthModalMode.SignIn:
        return <SignInContent setMode={setMode} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    return (
      <>
        {renderHeader()}
        {renderMode()}
        {renderFooter()}
      </>
    );
  };

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>{renderContent()}</DrawerContent>
    </Drawer>
  );
};

const SignInContent = ({
  setMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<AuthModalMode>>;
}) => {
  const { signIn } = useSignIn();
  const emailForm = useForm<{ email: string }>();

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    try {
      const res = await signIn?.create({
        identifier: email,
        strategy: "email_code",
      });
      console.log({ res });
      if (res?.status === "needs_first_factor") {
        setMode(AuthModalMode.EmailCode);
      }
      emailForm.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-6 pt-0 grid gap-4">
      <div className="grid grid-cols-2 gap-6">
        <Button variant={"outline"} onClick={() => signInWith("oauth_google")}>
          <SiGoogle className="h-4 w-4 mr-2" />
          Google
        </Button>
        <Button variant={"outline"} onClick={() => signInWith("oauth_discord")}>
          <SiDiscord className="h-4 w-4 mr-2" />
          Discord
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or just email
          </span>
        </div>
      </div>
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@domain.com" {...field} />
                </FormControl>
                <FormDescription>
                  {`You'll receive a link to sign in with`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
