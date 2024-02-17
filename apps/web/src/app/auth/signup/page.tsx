import { SignupForm } from "@/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up • MBSM",
};

export default async function AuthSignupPage() {
  return (
    <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
      <SignupForm />
    </div>
  );
}
