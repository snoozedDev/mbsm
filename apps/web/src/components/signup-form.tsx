"use client";
import { useSignUp } from "@clerk/clerk-react";
import type { OAuthStrategy } from "@clerk/types";

import { Button } from "./ui/button";

export const SignupForm = ({}) => {
  const { signUp, isLoaded } = useSignUp();

  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      {isLoaded ? (
        <Button onClick={() => signUpWith("oauth_google")}>google</Button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
