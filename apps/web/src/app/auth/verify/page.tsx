import { EmailVerification } from "@/components/email-verification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify • MBSM",
};

const AuthVerifyPage = () => {
  return <EmailVerification />;
};

export default AuthVerifyPage;
