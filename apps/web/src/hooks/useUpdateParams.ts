import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined) params.delete(key);
    else params.set(key, value);
    router.push(pathname + "?" + params.toString());
  };
};
