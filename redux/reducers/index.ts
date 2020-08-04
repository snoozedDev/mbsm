import { combineReducers } from "redux";
import { authReducer, AuthState } from "./auth";
import { feedReducer, FeedState } from "./feed";

export interface RootState {
  feed: FeedState;
  auth: AuthState;
}

export const rootReducer = combineReducers({
  feed: feedReducer,
  auth: authReducer,
});
