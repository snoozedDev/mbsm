"use client";
import { useSignedInStatus } from "@/queries/authQueries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useNeedsAuth = () => {
  const { isSignedIn, isPending } = useSignedInStatus();
  const router = useRouter();

  useEffect(() => {
    if (isPending && !isSignedIn) router.push("/");
  }, [isPending, isSignedIn, router]);
};
