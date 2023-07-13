import { NsfwWarningScreen } from "@/components/nsfw-warning-screen";
import { UserCard } from "@/components/user-card";
import { UserPosts } from "@/components/user-posts";
import { fakeGetPost, fakeGetUser } from "@/tmp/fakeFetch";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { user: string; postId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const nsfw = searchParams["nsfw"];
  const user = await fakeGetUser(params.user);
  if (!user) return {};
  const post = await fakeGetPost(params.postId);
  if (!post) return {};

  if (user.id !== post.authorId) return {};
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

  const description = post.body || user.bio;
  const title = post.title || user.displayName;
  const images =
    post.type === "image" ? post.images.map((i) => i.url) : [user.avatar.url];

  return {
    title,
    description,
    openGraph: {
      images,
      type: "article",
      siteName: "mbsm",
      authors: [user.username],
      publishedTime: post.postedAt,
      tags: post.tags,
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
      images,
    },
  };
}

export default async function UserPost({ params, searchParams }: Props) {
  const nsfw = searchParams["nsfw"];
  const user = await fakeGetUser(params.user);
  if (!user) redirect("/");
  const post = await fakeGetPost(params.postId);
  if (!post) redirect("/");

  if (user.id !== post.authorId) redirect("/");
  if (user.nsfw && nsfw !== "enabled") {
    return <NsfwWarningScreen />;
  }

  return (
    <div className="flex self-center space-x-4 py-12 px-4 max-w-5xl w-full">
      <main className="flex-grow space-y-4">
        <UserPosts user={user} posts={[post]} />
      </main>
      <aside className="max-md:hidden w-full max-w-xs">
        <UserCard user={user} />
      </aside>
    </div>
  );
}
