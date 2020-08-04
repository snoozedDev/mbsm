import { Action } from "redux";
import { User } from "../../utils/types";
import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS } from "../actions/auth";

export interface AuthState {
  user?: User;
  loading: boolean;
  loggedIn: boolean;
  fetched: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  loggedIn: false,
  loading: false,
  fetched: false,
};

export const authReducer = (
  state = initialAuthState,
  action: Action
): AuthState => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        loggedIn: false,
        loading: true,
        fetched: false,
      };
    case GET_USER_SUCCESS:
      const { user } = (action as any).payload;
      return {
        ...state,
        user,
        loggedIn: true,
        loading: false,
        fetched: true,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        user: null,
        loggedIn: false,
        loading: false,
        fetched: true,
      };
    default:
      return {
        ...state,
      };
      break;
  }
};
