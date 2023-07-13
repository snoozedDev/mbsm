"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentNsfwParam } from "@/hooks/useCurrentNsfwParam";
import { useUpdateParams } from "@/hooks/useUpdateParams";
import type {
  ImagePost,
  Post,
  Image as PostImage,
  TextPost,
} from "@/types/postTypes";
import { User } from "@/types/userTypes";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const PostTimestamp = ({ post, user }: { post: Post; user: User }) => {
  const dateTime = DateTime.fromISO(post.postedAt);

  const absolute = dateTime.toFormat("LLL d, yyyy");
  const relative = dateTime.toRelative();

  const useRelative = dateTime.diffNow().as("days") < 7;

  const nsfwParam = useCurrentNsfwParam();

  return (
    <Button
      asChild
      variant="link"
      className="text-muted-foreground/80 self-end"
    >
      <Link
        href={`/${user.username}/${post.id}${nsfwParam}`}
        className="text-right text-sm font-light"
      >
        {useRelative ? relative : absolute}
      </Link>
    </Button>
  );
};

const PostTag = ({ tag, user }: { tag: string; user: User }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("tag", tag);

    router.push(`/${user.username}?${newParams.toString()}`);
  };

  return (
    <Button
      onClick={onClick}
      variant="link"
      className="px-2 py-1 text-muted-foreground/80 text-sm"
    >
      <li className="rounded-full mr-2">#{tag}</li>
    </Button>
  );
};

const PostTags = ({ post, user }: { post: Post; user: User }) => {
  return post.tags ? (
    <ul className="flex flex-wrap text-sm text-muted-foreground/80">
      {post.tags?.map((tag) => (
        <PostTag key={tag} user={user} tag={tag} />
      ))}
    </ul>
  ) : null;
};

const PostImage = ({
  image,
  maxHeight,
  maxWidth,
}: {
  image: PostImage;
  maxHeight?: number;
  maxWidth?: number;
}) => {
  return (
    <div className="relative">
      <Image
        layout="responsive"
        src={image.url}
        alt={image.id}
        width={image.width}
        height={image.height}
      />
    </div>
  );
};

const ImagePost = ({ post, user }: { post: ImagePost; user: User }) => {
  return (
    <article>
      <Card className="rounded-lg overflow-hidden">
        {post.title && (
          <CardHeader className="pb-0">
            {post.title && <CardTitle>{post.title}</CardTitle>}
          </CardHeader>
        )}
        <CardContent className="mt-6">
          {post.body && <p>{post.body}</p>}
        </CardContent>
        <CardContent className="px-0">
          <PostImage image={post.images[0]} maxHeight={200} maxWidth={400} />
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <PostTags post={post} user={user} />
          <PostTimestamp user={user} post={post} />
        </CardFooter>
      </Card>
    </article>
  );
};

const TextPost = ({ post, user }: { post: TextPost; user: User }) => {
  return (
    <article>
      <Card className="rounded-lg overflow-hidden">
        {post.title && (
          <CardHeader className="pb-0">
            {post.title && <CardTitle>{post.title}</CardTitle>}
          </CardHeader>
        )}
        <CardContent className="mt-6">
          {post.body && <p>{post.body}</p>}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <PostTags post={post} user={user} />
          <PostTimestamp user={user} post={post} />
        </CardFooter>
      </Card>
    </article>
  );
};

const PostMapper = ({ post, ...props }: { post: Post; user: User }) => {
  switch (post.type) {
    case "image":
      return <ImagePost post={post} {...props} />;
    case "text":
      return <TextPost post={post} {...props} />;
    default:
      return null;
  }
};

export function UserPosts({
  posts,
  tag,
  user,
}: {
  user: User;
  posts: Post[];
  tag?: string;
}) {
  const filteredPosts = tag
    ? posts.filter((post) => post.tags?.includes(tag))
    : posts;

  const noPosts = filteredPosts.length === 0;

  const updateParams = useUpdateParams();

  const onSearchClear = () => updateParams("tag", undefined);

  return (
    <React.Fragment>
      {noPosts && (
        <div className="flex flex-col items-center justify-center space-y-4 py-12 px-4 w-full flex-1">
          <h1 className="text-2xl font-bold">No posts found</h1>
          {tag ? (
            <Button
              variant="outline"
              onClick={onSearchClear}
              className="ml-1 px-2 text-base text-muted-foreground/80 font-normal"
            >
              Clear your search
            </Button>
          ) : (
            <p className="text-muted-foreground/80 text-center">
              This user has not posted anything yet.
            </p>
          )}
        </div>
      )}
      {filteredPosts.map((post) => (
        <PostMapper key={post.id} post={post} user={user} />
      ))}
    </React.Fragment>
  );
}
