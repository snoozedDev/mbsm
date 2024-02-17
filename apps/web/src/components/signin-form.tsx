"use client";
import { useSignIn } from "@clerk/clerk-react";
import type { OAuthStrategy } from "@clerk/types";
import { Button } from "./ui/button";

export const SigninForm = ({}) => {
  const { signIn, isLoaded } = useSignIn();

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      {isLoaded ? (
        <Button onClick={() => signInWith("oauth_google")}>google</Button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
