import multer from "multer";
import nc, { NextConnect } from "next-connect";
import util from "util";
import { Image } from "../../../db/models/image";
import { User } from "../../../db/models/user";
import { authMiddleware } from "../../../utils/auth";
import { AvatarResponse } from "../../../utils/types";
import { generateId } from "../../../utils/utils";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 },
}).single("file");

const handler: NextConnect = nc()
  .use(authMiddleware)
  .patch(async (req: any, res: any) => {
    let response: AvatarResponse = {
      success: false,
      error: "Unknown.",
    };

    avatar: try {
      await util.promisify(upload)(req, res);

      const filename = `avatar/${generateId()}.png`;
      const image = await Image.upload(filename, req.file.buffer);
      await User.changeAvatar(req.user.id, image.id);

      response.success = true;
      response.avatar = {
        url: image.url,
      };
      response.error = undefined;
    } catch (e) {
      if (e instanceof multer.MulterError) {
        response.error = "Too big, onii-chan.";
        break avatar;
      }
      console.log(e);
    }

    res.send(response);
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
