import { AccountPage } from "@/components/account/account-page";
import { Metadata } from "next";

export type UserPageProps = {
  params: { handle: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: UserPageProps): Promise<Metadata> {
  return {};
}

export default async function User({ params, searchParams }: UserPageProps) {
  // const nsfw = searchParams["nsfw"];
  // const tag = searchParams["tag"];
  // const user = await getAccountByHandle(params.handle);
  // if (!user) redirect("/");
  // const posts = await fakeGetUserPosts(user.id);

  // if (typeof tag !== "undefined" && typeof tag !== "string") redirect("/");
  // if (user.nsfw && nsfw !== "enabled") {
  //   return <NsfwWarningScreen />;
  // }

  return <AccountPage />;
}
