import { NsfwWarningScreen } from "@/components/nsfw-warning-screen";
import { UserCard } from "@/components/user-card";
import { UserPosts } from "@/components/user-posts";
import { fakeGetUser, fakeGetUserPosts } from "@/tmp/fakeFetch";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
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
      openGraph: {
        title,
        description,
      },
    };
  }

  const description = user.bio;
  const title = user.displayName;

  return {
    title,
    description,
    openGraph: {
      images: [user.avatar.url],
      type: "profile",
      siteName: "mbsm",
      username: user.username,
      title,
      description,
    },
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

export default async function User({ params, searchParams }: Props) {
  const nsfw = searchParams["nsfw"];
  const tag = searchParams["tag"];
  const user = await fakeGetUser(params.user);
  if (!user) redirect("/");
  const posts = await fakeGetUserPosts(user.id);

  if (typeof tag !== "undefined" && typeof tag !== "string") redirect("/");
  if (user.nsfw && nsfw !== "enabled") {
    return <NsfwWarningScreen />;
  }

  return (
    <div className="flex self-center space-x-4 py-12 px-4 max-w-5xl w-full">
      <main className="flex-grow space-y-4">
        <UserPosts user={user} tag={tag} posts={posts} />
      </main>
      <aside className="max-md:hidden w-full max-w-xs">
        <UserCard user={user} />
      </aside>
    </div>
  );
}
