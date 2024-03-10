"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentNsfwParam } from "@/hooks/useCurrentNsfwParam";
import { useUpdateParams } from "@/hooks/useUpdateParams";
import { cn } from "@/lib/utils";
import { FakeImage, FakePost, FakeUser } from "@/tmp/fakeFetch";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { HtmlHTMLAttributes } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const PostTimestamp = ({ post, user }: { post: FakePost; user: FakeUser }) => {
  const dateTime = DateTime.fromISO(post.postedAt);

  const absolute = dateTime.toFormat("LLL d, yyyy");
  const absoluteDetailed = dateTime.toFormat("LLL d, yyyy 'at' t");
  const relative = dateTime.toRelative();

  const useRelative = dateTime.diffNow().as("days") < 7;

  const nsfwParam = useCurrentNsfwParam();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="link"
            className="text-muted-foreground/80 p-0 leading-none h-auto"
          >
            <Link
              href={`/${user.username}/${post.id}${nsfwParam}`}
              className="text-right text-sm font-light"
            >
              {useRelative ? relative : absolute}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="ml-2" side="right" align="start">
          <p>{absoluteDetailed}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const PostTag = ({ tag, user }: { tag: string; user: FakeUser }) => {
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
      className="pl-0 pr-2 py-1 text-muted-foreground/80 text-sm"
    >
      <li className="rounded-full mr-2">#{tag}</li>
    </Button>
  );
};

const PostTags = ({ post, user }: { post: FakePost; user: FakeUser }) => {
  return post.tags ? (
    <ul className="flex flex-wrap text-sm text-muted-foreground/80">
      {post.tags.map((tag) => (
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
  image: FakeImage;
  maxHeight?: number;
  maxWidth?: number;
}) => {
  return (
    image && (
      <div className="relative">
        <Image
          layout="responsive"
          src={image.url}
          alt={image.id}
          width={image.width ?? undefined}
          height={image.height ?? undefined}
        />
      </div>
    )
  );
};

const UserAvatar = ({
  user,
  className,
}: {
  user?: FakeUser;
  isLoading?: boolean;
  className?: HtmlHTMLAttributes<HTMLDivElement>["className"];
}) => {
  return (
    <div className={cn("rounded-lg overflow-hidden relative", className)}>
      {user && (
        <Image
          className="absolute inset-0 z-10"
          src={user.avatar.url}
          height={user.avatar.height ?? undefined}
          width={user.avatar.width ?? undefined}
          alt={`${user.displayName}' avatar`}
        />
      )}
      <Skeleton className="absolute inset-0 z-0" />
    </div>
  );
};

const PostContainer = ({
  post,
  user,
  children,
}: {
  post: FakePost;
  user: FakeUser;
  children: React.ReactNode;
}) => (
  <article className="flex relative">
    <Card className="rounded-lg overflow-hidden flex-1 flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex">
          <UserAvatar className="w-14 h-14 mr-4 md:hidden" user={user} />
          <div>
            <div className="flex space-x-2 items-center">
              <CardTitle className="text-base font-bold">
                {user.displayName}
              </CardTitle>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                @{user.username}
              </CardTitle>
            </div>
            <CardDescription>
              <PostTimestamp user={user} post={post} />
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {post.title && <CardTitle>{post.title}</CardTitle>}
      {children}
      <CardFooter className="flex flex-col items-start">
        <PostTags post={post} user={user} />
      </CardFooter>
    </Card>
  </article>
);

const ImagePostContent = ({ post }: { post: FakePost }) => {
  return (
    <React.Fragment>
      <CardContent className="mt-6">
        {post.body && <p>{post.body}</p>}
      </CardContent>
      <CardContent className="px-0">
        {post.images && (
          <PostImage image={post.images[0]} maxHeight={200} maxWidth={400} />
        )}
      </CardContent>
    </React.Fragment>
  );
};

const TextPostContent = ({ post }: { post: FakePost }) => {
  return (
    <React.Fragment>
      {post.title && (
        <CardHeader className="pb-0">
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
      )}
      {post.body && (
        <CardContent className="mt-6">
          <p>{post.body}</p>
        </CardContent>
      )}
    </React.Fragment>
  );
};

const PostMapper = ({
  post,
  user,
  ...props
}: {
  post: FakePost;
  user: FakeUser;
}) => {
  let content = null;

  if (post.type === "image") content = <ImagePostContent post={post} />;
  if (post.type === "text") content = <TextPostContent post={post} />;

  return (
    <PostContainer post={post} user={user}>
      {content}
    </PostContainer>
  );
};

export function UserPosts({
  posts,
  tag,
  user,
}: {
  user: FakeUser;
  posts: FakePost[];
  tag?: string;
}) {
  const filteredPosts = tag
    ? posts.filter((post) => post.tags?.includes(tag))
    : posts;

  const noPosts = filteredPosts.length === 0;

  const updateParams = useUpdateParams();

  const onSearchClear = () => updateParams("tag", undefined);

  return (
    <div className="flex flex-col space-y-4 w-full flex-1 relative">
      {/* {isMobile && (
        <React.Fragment>
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            whileDrag={{
              cursor: "grabbing",
            }}
            className="absolute inset-0 bg-transparent z-10"
          />
        </React.Fragment>
      )} */}
      {/* <div
        className="w-10 h-10 bg-foreground"
        style={{
          scale,
        }}
      /> */}
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
    </div>
  );
}
