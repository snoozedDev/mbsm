import React, { useEffect, useState } from "react";
import { User } from "../../utils/types";
import { calculateRelativeDate } from "../../utils/time.";
import css from "./PostAuthor.module.scss";

interface PostAuthorProps {
  author: User;
  time: string;
  live?: boolean;
}

export const PostAuthor = ({ author, time, live }: PostAuthorProps) => {
  const [date, setDate] = useState(calculateRelativeDate(time));

  useEffect(() => {
    if (live) {
      const update = setInterval(() => {
        setDate(calculateRelativeDate(time));
      }, 1000);
      return () => clearInterval(update);
    }
  }, [live]);

  return (
    <div className={css.post_author_container}>
      <span className={css.post_author_name}>{author.username}</span>
      <span className={css.post_author_date}>{date}</span>
    </div>
  );
};
