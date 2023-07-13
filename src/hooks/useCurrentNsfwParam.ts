import { useSearchParams } from "next/navigation";

export const useCurrentNsfwParam = () => {
  const searchParams = useSearchParams();

  const nsfw = searchParams.get("nsfw");

  return nsfw ? `?nsfw=${nsfw}` : "";
};
