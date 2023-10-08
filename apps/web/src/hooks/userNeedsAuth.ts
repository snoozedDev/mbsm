"use client";
import { useUserQuery } from "@/queries/authQueries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useNeedsAuth = () => {
  const { status } = useUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (status === "error") router.push("/");
  }, [status, router]);
};
