import axios from "axios";
import { NextPageContext } from "next";
import { environment } from "../../../utils/env";

const { WEB_URL } = environment;

const Post = (props) => {
  return <div>{JSON.stringify(props)}</div>;
};

Post.getInitialProps = async ({ req, query }: NextPageContext) => {
  const { data } = await axios.get(`${WEB_URL}/api/post/${query.post_id}`, {
    headers: { Cookie: req.headers.cookie },
  });

  return { ...data, requestedId: query.post_id };
};

export default Post;
