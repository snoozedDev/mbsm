import { NsfwWarningScreen } from "@/components/nsfw-warning-screen";
import { UserPosts } from "@/components/user-posts";
import { fakeGetUser, fakeGetUserPosts } from "@/tmp/fakeFetch";
import { getEnvAsStr } from "@mbsm/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export type UserPageProps = {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: UserPageProps): Promise<Metadata> {
  const nsfw = searchParams["nsfw"];
  const tag = searchParams["tag"];
  const user = await fakeGetUser(params.user);
  if (!user) return {};
  if (typeof tag !== "undefined" && typeof tag !== "string") return {};
  if (user.nsfw && nsfw !== "enabled") {
    const title = "NSFW Warning";
    const description =
      "This site contains NSFW content. If you are under 18 or are not comfortable with NSFW content, do not continue.";
    return {
      title,
      description,
      metadataBase: new URL(getEnvAsStr("ORIGIN")),
      openGraph: {
        title,
        description,
      },
    };
  }

  const description = user.bio;
  const title = user.displayName;

  return {
    title: `${title} • MBSM`,
    description,
    openGraph: {
      images: [user.avatar.url],
      type: "profile",
      siteName: "mbsm",
      username: user.username,
      title,
      description,
    },
    metadataBase: new URL(getEnvAsStr("ORIGIN")),
    twitter: {
      card: "summary",
      creator: user.links
        ?.find((link) => link.name === "twitter")
        ?.url.replace("https://twitter.com/", "@"),
      title,
      description,
      images: [user.avatar.url],
    },
  };
}

export default async function User({ params, searchParams }: UserPageProps) {
  const nsfw = searchParams["nsfw"];
  const tag = searchParams["tag"];
  const user = await fakeGetUser(params.user);
  if (!user) redirect("/");
  const posts = await fakeGetUserPosts(user.id);

  if (typeof tag !== "undefined" && typeof tag !== "string") redirect("/");
  if (user.nsfw && nsfw !== "enabled") {
    return <NsfwWarningScreen />;
  }

  return <UserPosts user={user} tag={tag} posts={posts} />;
}
