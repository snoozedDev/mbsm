import { getUserInfo } from "@/app/actions/authActions";
import { RegisterForm } from "@/components/register-form";
import { queryClient } from "@/queries/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up • MBSM",
};

export default async function AuthRegisterPage() {
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="xs:max-w-md w-full self-center mt-16 p-4 relative">
        <RegisterForm />
      </div>
    </HydrationBoundary>
  );
}
