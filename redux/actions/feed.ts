import { getFeedAPI } from "../../utils/api";

export const GET_FEED = "GET_FEED";
export const GET_FEED_SUCCESS = "GET_FEED_SUCCESS";
export const GET_FEED_FAILURE = "GET_FEED_FAILURE";

export const getFeed = () => (dispatch) => {
  dispatch({ type: GET_FEED });
  return (async () => {
    const result = await getFeedAPI();
    if (result.success)
      dispatch({
        type: GET_FEED_SUCCESS,
        payload: {
          posts: result.feed,
        },
      });
  })();
};
