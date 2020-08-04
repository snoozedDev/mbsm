import { getUserAPI } from "../../utils/api";

export const GET_USER = "GET_USER";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILURE = "GET_USER_FAILURE";

export const getUser = () => (dispatch) => {
  dispatch({ type: GET_USER });
  return (async () => {
    const result = await getUserAPI();
    if (result.success)
      dispatch({
        type: GET_USER_SUCCESS,
        payload: {
          user: result.user,
        },
      });
    else dispatch({ type: GET_USER_FAILURE });
  })();
};
