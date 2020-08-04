import { TextPost } from "../../utils/types";
import { Action } from "redux";
import { GET_FEED, GET_FEED_SUCCESS } from "../actions/feed";

export interface FeedState {
  loading: boolean;
  error: boolean;
  errorMessage: string;
  posts: TextPost[];
}

const initialFeedState: FeedState = {
  loading: false,
  error: false,
  errorMessage: "",
  posts: [],
};

export const feedReducer = (
  state = initialFeedState,
  action: Action
): FeedState => {
  switch (action.type) {
    case GET_FEED:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case GET_FEED_SUCCESS:
      const { posts } = (action as any).payload;
      return {
        ...state,
        loading: false,
        posts,
      };
    default:
      return {
        ...state,
      };
      break;
  }
};
