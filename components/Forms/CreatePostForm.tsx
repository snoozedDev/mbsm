import React, { useState } from "react";
import { ResizableTextarea } from "./ResizableTextarea";
import css from "./CreatePostForm.module.scss";
import { User } from "../../utils/types";
import { PostAvatar } from "../Common/PostAvatar";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import { PostAuthor } from "../Common/PostAuthor";
import moment from "moment";

interface CreatePostFormProps {
  user: User;
  onSubmit?: () => {};
  onCancel?: () => {};
}

const mapStateToProps = ({ feed, auth }: RootState) => {
  return {
    user: auth.user,
  };
};

export const CreatePostForm = connect(mapStateToProps)(
  ({ user }: CreatePostFormProps) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    return (
      <div className={css.create_post_form_container}>
        <PostAvatar avatar={user.avatar} />
        <PostAuthor live author={user} time={moment().format()} />
        <ResizableTextarea
          className={css.form_title}
          minRows={1}
          maxRows={2}
          maxLength={72}
          disableNewLine
          value={title}
          setValue={setTitle}
          placeholder={"title (optional)"}
        />
        <ResizableTextarea
          className={css.form_body}
          minRows={5}
          maxRows={20}
          maxLength={1024}
          value={body}
          setValue={setBody}
          placeholder={"body"}
        />
      </div>
    );
  }
);
