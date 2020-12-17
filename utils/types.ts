export type mbsmEnv = {
  NODE_ENV: "development" | "production" | "test";

  WEB_URL: string;

  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;

  SESSION_NAME: string;
  SESSION_SECRET: string;

  CDN_REGION: string;
  CDN_BUCKET: string;
  CDN_KEY: string;
  CDN_SECRET: string;
  CDN_URL: string;
};

export interface APIResponse {
  success: boolean;
  error: string;
}

export interface User {
  username: string;
  avatar: string;
}

export interface OtherUser extends User {
  following: boolean;
}

export interface Image {
  url: string;
}

export type Tag = string;

export type TagUI = {
  tag: Tag;
  occurrences?: number;
};

export type PostType = "text" | "image";

export interface Post {
  type: PostType;
  author: OtherUser;
  tags: Tag[];
  created_at: string;
}

export interface TextPost extends Post {
  type: "text";
  title: string;
  body: string;
}

export interface ImagePost extends Post {
  type: "image";
  images: Image[];
  body?: string;
}

export interface LoginResponse extends APIResponse {}

export interface SignupResponse extends APIResponse {}

export interface CreatePostResponse extends APIResponse {}

export interface UserResponse extends APIResponse {
  user?: User;
}

export interface ProfileResponse extends APIResponse {
  user?: OtherUser;
}

export interface PostResponse extends APIResponse {
  post?: Post;
}

export interface TagAutocompleteResponse extends APIResponse {
  tags?: TagUI[];
}

export interface FeedResponse extends APIResponse {
  feed?: TextPost[];
}

export interface AvatarResponse extends APIResponse {
  avatar?: Image;
}

export interface mbsmSession {
  username: string;
}

export type UIElementSize = "small" | "medium" | "large";
export type NordColor =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
