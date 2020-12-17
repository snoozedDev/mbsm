import nc from "next-connect";
import { Tag } from "../../../db/models/tag";
import { renewTokenCookie } from "../../../utils/auth";
import { TagAutocompleteResponse } from "../../../utils/types";

const handler = nc().get(async (req, res) => {
  let response: TagAutocompleteResponse = {
    success: false,
    error: "Unknown.",
  };

  try {
    const { text, ignoreTags } = req.query;
    const tagsToIgnore = (ignoreTags as string).split(",");
    const tags = await Tag.search(text as string, tagsToIgnore);

    renewTokenCookie(req, res);
    response.success = true;
    response.error = undefined;
    response.tags = tags;
  } catch (e) {
    console.log(e);
  }

  res.send(response);
});

export default handler;
