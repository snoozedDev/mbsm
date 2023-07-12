import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkIcon, TwitterIcon } from "lucide-react";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

const Post = () => {
  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </article>
  );
};

const posts = [
  {
    id: "1",
    title: "Post 1",
    content: "Post 1 content",
  },
  {
    id: "2",
    title: "Post 1",
    content: "Post 1 content",
  },
  {
    id: "3",
    title: "Post 1",
    content: "Post 1 content",
  },
  {
    id: "4",
    title: "Post 1",
    content: "Post 1 content",
  },
  {
    id: "5",
    title: "Post 1",
    content: "Post 1 content",
  },
  {
    id: "6",
    title: "Post 1",
    content: "Post 1 content",
  },
];

export default function Home() {
  return (
    <div className="flex self-center space-x-4 py-12 px-4 max-w-4xl w-full">
      <main className="flex-grow space-y-4">
        {posts.map((post) => (
          <Post key={post.id} />
        ))}
      </main>
      <aside className="max-md:hidden w-full max-w-xs sticky top-0">
        <Card>
          <CardHeader className="space-y-2">
            <Avatar className="w-12 h-12 rounded-lg mr-4">
              <AvatarImage src="https://pbs.twimg.com/profile_images/1669794702759960583/g4itsVS__400x400.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <h1 className="text-lg font-medium">forurune</h1>
              <span className="text-muted-foreground text-xs font-light">
                @forurune
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p>the admin of this site</p>
          </CardContent>
          <CardFooter>
            <ul>
              <li className="flex items-center">
                <TwitterIcon className="w-4" />
                <Button asChild variant="link">
                  <Link href={"https://twitter.com/foru_rune"}>twitter</Link>
                </Button>
              </li>
              <li className="flex items-center">
                <LinkIcon className="w-4" />
                <Button asChild variant="link">
                  <Link href={"https://baraag.net/@furry"}>baraag</Link>
                </Button>
              </li>
            </ul>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
