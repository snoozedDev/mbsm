import cn from "classname";
import React from "react";
import { PostType } from "../../utils/types";
import css from "./PostTypeSelector.module.scss";

const postTypes: PostType[] = ["text", "image"];

interface PostTypeSelectorProps {
  postType: PostType;
  setPostType: React.Dispatch<React.SetStateAction<PostType>>;
}

export const PostTypeSelector = ({
  postType,
  setPostType,
}: PostTypeSelectorProps) => {
  return (
    <div className={css.post_type_selector_container}>
      {postTypes.map((type) => (
        <SinglePostType
          onClick={() => setPostType(type)}
          selected={type === postType}
          type={type}
        />
      ))}
    </div>
  );
};

const SinglePostType = ({
  selected,
  type,
  onClick,
}: {
  selected: boolean;
  type: PostType;
  onClick: () => void;
}) => {
  const renderIcon = () => {
    switch (type) {
      case "text":
        return (
          <div className={css.text}>
            <span className={css.latin}>a</span>
            <span className={css.hiragana}>あ</span>
          </div>
        );
      case "image":
        return <img className={css.image} src="/svgs/gallery.svg" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(css.single_post_type, selected && css.selected)}
    >
      {renderIcon()}
    </div>
  );
};
