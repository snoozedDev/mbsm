import { SigninForm } from "@/components/signin-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In • MBSM",
};

export default async function AuthSignupPage() {
  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      <SigninForm />
    </div>
  );
}
