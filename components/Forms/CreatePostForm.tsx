import moment from "moment";
import React, { useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import { Image, PostType, TagUI, User } from "../../utils/types";
import { PostAuthor } from "../Common/PostAuthor";
import { PostAvatar } from "../Common/PostAvatar";
import { SquareButton } from "../Common/SquareButton";
import css from "./CreatePostForm.module.scss";
import { ImageForm } from "./ImageForm";
import { PostTypeSelector } from "./PostTypeSelector";
import { ResizableTextarea } from "./ResizableTextarea";
import { TagForm } from "./TagForm";

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
    const [tags, setTags] = useState<TagUI[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [postType, setPostType] = useState<PostType>("image");

    const isText = postType === "text";
    const isImage = postType === "image";

    return (
      <div className={css.create_post_form_container}>
        <PostAvatar avatar={user.avatar} />
        <PostTypeSelector postType={postType} setPostType={setPostType} />
        <PostAuthor author={user} time={moment().format()} />
        {isText && (
          <ResizableTextarea
            containerClassName={css.form_title_container}
            className={css.form_title}
            minRows={1}
            maxRows={2}
            maxLength={72}
            disableNewLine
            value={title}
            setValue={setTitle}
            placeholder={"title (optional)"}
          />
        )}
        {isImage && <ImageForm />}
        <ResizableTextarea
          containerClassName={css.form_body_container}
          className={css.form_body}
          minRows={isText ? 5 : 2}
          maxRows={20}
          maxLength={1024}
          value={body}
          setValue={setBody}
          placeholder={"body"}
        />
        <TagForm canCreateTags tags={tags} setTags={setTags} />
        <div className={css.buttons_row}>
          <SquareButton
            text="DISCARD"
            nordBackground={2}
            nordText={4}
            size="large"
          />
          <SquareButton
            text="POST"
            nordBackground={8}
            nordText={1}
            size="large"
          />
        </div>
      </div>
    );
  }
);
