import { Post, User } from "@mbsm/types";

const serverUsers: User[] = [
  {
    id: "rakMvxar4_Cg",
    username: "forurune",
    displayName: "forurune",
    nsfw: true,
    avatar: {
      id: "TG5elKTaKd3iiUL7",
      height: 300,
      width: 300,
      url: "https://cdn.mbsm.io/full/TG5elKTaKd3iiUL7.png",
    },
    bio: "the creator of this website and nanachi god",
    links: [
      {
        name: "twitter",
        url: "https://twitter.com/foru_rune",
      },
      {
        name: "baraag",
        url: "https://baraag.net/@furry",
      },
    ],
    joinedAt: "2023-07-12T00:00:00.000Z",
  },
];

const serverPosts: Post[] = [
  {
    type: "text",
    id: "j_hJO_thNUhDlg92C63af",
    authorId: "rakMvxar4_Cg",
    body: "still working on this",
    postedAt: "2024-01-22T15:10:46.000Z",
    tags: ["tags", "are", "still", "cool"],
  },
  {
    type: "text",
    id: "I7w7Ix0qU_zmBBJK",
    authorId: "rakMvxar4_Cg",
    body: "ban this",
    postedAt: "2023-07-12T07:25:12.000Z",
    tags: ["tags", "are", "cool"],
  },
  {
    id: "NX3gAkvyHeFMq7ET",
    type: "image",
    authorId: "rakMvxar4_Cg",
    body: "first post is nanachi",
    images: [
      {
        hotspot: {
          x: 0.5,
          y: 0.5,
          height: 0.5,
          width: 0.5,
        },
        id: "yumWzPVApyokUTTm",
        url: "https://cdn.mbsm.io/full/yumWzPVApyokUTTm.png",
        height: 2225,
        width: 1913,
      },
    ],
    tags: ["furry", "nanachi", "made_in_abyss", "loli", "suggestive"],
    postedAt: "2023-07-12T04:29:24.000Z",
  },
];

export const fakeGetUser = async (username: string) => {
  const user = serverUsers.find((user) => user.username === username);
  return user;
};

export const fakeGetUserPosts = async (userId: string) => {
  const posts = serverPosts.filter((post) => post.authorId === userId);
  return posts;
};

export const fakeGetPost = async (postId: string) => {
  const post = serverPosts.find((post) => post.id === postId);
  return post;
};
