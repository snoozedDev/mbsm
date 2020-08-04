import React from "react";
import css from "./PostAvatar.module.scss";

export const PostAvatar = ({ avatar }: { avatar: string }) => {
  return (
    <div className={css.post_author_container}>
      <div className={css.author_avatar_container}>
        <img className={css.author_avatar} src={avatar} />
      </div>
    </div>
  );
};
