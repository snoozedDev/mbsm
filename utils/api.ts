import axios from "axios";
import {
  APIResponse,
  AvatarResponse,
  CreatePostResponse,
  FeedResponse,
  LoginResponse,
  SignupResponse,
  TagAutocompleteResponse,
  UserResponse,
} from "./types";

interface SignupForm {
  username: string;
  password: string;
}

interface LoginForm {
  username: string;
  password: string;
}

export interface CreatePostForm {
  title: string;
  body: string;
  tags: string;
}

export interface AutocompleteForm {
  text: string;
  ignoreTags: string;
}

export const login = async (postData: LoginForm): Promise<LoginResponse> => {
  const { data } = await axios.post(`/api/auth/login`, postData);
  return data;
};

export const logout = async (): Promise<APIResponse> => {
  const { data } = await axios.get("/api/auth/logout");
  return data;
};

export const signup = async (postData: SignupForm): Promise<SignupResponse> => {
  const { data } = await axios.post(`/api/auth/signup`, postData);
  return data;
};

export const getUserAPI = async (): Promise<UserResponse> => {
  const { data } = await axios.get(`/api/auth/user`);
  return data;
};

export const createPost = async (
  postData: CreatePostForm
): Promise<CreatePostResponse> => {
  const { data } = await axios.post(`/api/post/create`, postData);
  return data;
};

export const followUser = async ({
  username,
}: {
  username: string;
}): Promise<APIResponse> => {
  const { data } = await axios.post(`/api/user/follow`, { username });
  return data;
};

export const unfollowUser = async ({
  username,
}: {
  username: string;
}): Promise<APIResponse> => {
  const { data } = await axios.post(`/api/user/unfollow`, { username });
  return data;
};

export const getFeedAPI = async (): Promise<FeedResponse> => {
  const { data } = await axios.get(`/api/post/feed`);
  return data;
};

export const uploadAvatar = async (
  formData: FormData
): Promise<AvatarResponse> => {
  const { data } = await axios.patch(`/api/auth/avatar`, formData);
  return data;
};

export const autocompleteTag = async ({
  text,
  ignoreTags,
}: AutocompleteForm): Promise<TagAutocompleteResponse> => {
  console.log(ignoreTags);
  const { data } = await axios.get(`/api/tag/autocomplete`, {
    params: { text, ignoreTags },
  });
  return data;
};
