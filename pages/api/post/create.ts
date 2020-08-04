import { NextApiHandler } from "next";
import { Post } from "../../../db/models/post";
import { Tag } from "../../../db/models/tag";
import { User } from "../../../db/models/user";
import { CreatePostForm } from "../../../utils/api";
import { getSession } from "../../../utils/auth";
import { CreatePostResponse } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return res.send(404);

  let response: CreatePostResponse = {
    success: false,
    error: "Unknown.",
  };

  create: try {
    const { title, body, tags }: CreatePostForm = req.body;

    const session = await getSession(req);
    const user = await User.getByUsername(session.username);
    if (!user) {
      response.error = "Unauthenticated.";
      break create;
    }
    const post = await Post.create({
      type_id: 1,
      author_id: user.id,
      title,
      body,
    });
    const fileteredTags = tags.split(" ").filter((t) => t.length > 1);
    const processedTags = fileteredTags.filter(
      (t, i) => fileteredTags.indexOf(t) === i
    );
    await Tag.createOrGetFromArray(processedTags);
    await Tag.relateToPostFromArray(processedTags, post.id);

    if (!post) {
      break create;
    }

    response.success = true;
    response.error = undefined;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
};

export default handler;
