import cn from "classname";
import * as R from "ramda";
import React, { useEffect, useRef, useState } from "react";
import { autocompleteTag } from "../../utils/api";
import { TagUI } from "../../utils/types";
import css from "./TagForm.module.scss";

interface TagFormProps {
  tags: TagUI[];
  setTags: React.Dispatch<React.SetStateAction<TagUI[]>>;
  canCreateTags?: boolean;
  maxLengthPerTag?: number;
  maxTags?: number;
}

export const TagForm = ({
  tags,
  setTags,
  canCreateTags,
  maxLengthPerTag = 72,
  maxTags = 32,
}: TagFormProps) => {
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<TagUI[]>([]);

  const tagInput = useRef<HTMLInputElement>(undefined);

  useEffect(() => {
    if (inputHasFocus) addEventListener("keydown", onKeyboard);
    return () => removeEventListener("keydown", onKeyboard);
  }, [inputHasFocus, hoverIndex, searchValue, tags, suggestedTags]);

  const unsetHoverIndex = () => setHoverIndex(-1);

  const onKeyboard = (ev: KeyboardEvent) => {
    //ENTER
    if (ev.keyCode === 13) {
      ev.preventDefault();
      const selectedTag = suggestedTags[hoverIndex]
        ? suggestedTags[hoverIndex]
        : { tag: searchValue };
      if (selectedTag && !tags.some((tag) => tag.tag === selectedTag.tag)) {
        addTag(selectedTag);
      }
    }
    //DOWN
    if (ev.keyCode === 40) {
      ev.preventDefault();
      let newIndex = hoverIndex + 1;
      if (newIndex >= getCurrentOptionLength()) newIndex = 0;
      setHoverIndex(newIndex);
    }
    //UP
    if (ev.keyCode === 38) {
      ev.preventDefault();
      let newIndex = hoverIndex - 1;
      if (newIndex < 0) newIndex = getCurrentOptionLength() - 1;
      setHoverIndex(newIndex);
    }
    //BACKSPACE
    if (ev.keyCode === 8) {
      if (R.isEmpty(searchValue) && !R.isEmpty(tags)) {
        ev.preventDefault();
        removeTag(tags.slice(-1)[0]);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    cancelFetchingQueue();
    unsetHoverIndex();
    if (event.target.value.length < 1) {
      clearSuggestedTags();
      return;
    }
    queueFetching(event.target.value);
  };

  const fetchAutocomplete = async (searchTerm: string) => {
    const result = await autocompleteTag({
      text: searchTerm,
      ignoreTags: tags.map((tag) => tag.tag).join(","),
    });
    if (result.success) {
      setSuggestedTags(result.tags);
    }
  };

  const clearSuggestedTags = () => setSuggestedTags([]);

  let fetchingTimeout;
  const queueFetching = (searchTerm: string) => {
    cancelFetchingQueue();
    fetchingTimeout = setTimeout(() => {
      fetchAutocomplete(searchTerm);
    }, 500);
  };

  const cancelFetchingQueue = () => {
    clearTimeout(fetchingTimeout);
  };

  const removeTag = (tag: TagUI) => {
    setTags([...R.without([tag], tags)]);
  };

  const addTag = (tag: TagUI) => {
    if (
      tag.occurrences ||
      (canCreateTags && tags.length < maxTags && tag.tag.length > 2)
    ) {
      setTags([...tags, tag]);
      setSuggestedTags([]);
      setSearchValue("");
    }
  };

  const getCurrentOptionLength = () =>
    suggestedTags.length + (canCreateTags ? 1 : 0);

  const onInputFocus = () => {
    setInputHasFocus(true);
  };

  const onInputBlur = () => {
    setInputHasFocus(false);
  };

  const shouldShowSuggestedTags =
    (canCreateTags && inputHasFocus && !R.isEmpty(searchValue)) ||
    (!canCreateTags &&
      inputHasFocus &&
      !R.isEmpty(suggestedTags) &&
      !R.isEmpty(searchValue));

  return (
    <div className={css.tag_form_container}>
      {tags.map((tag, i) => (
        <SingleTag key={i} tag={tag} removeTag={removeTag} />
      ))}
      <div className={css.tag_input_container}>
        {shouldShowSuggestedTags && (
          <SuggestedTags
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            searchText={searchValue}
            tags={suggestedTags}
            selectTag={addTag}
            canCreateTags={canCreateTags}
          />
        )}
        <input
          maxLength={maxLengthPerTag}
          ref={tagInput}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          className={css.tag_input}
          value={searchValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

interface SingleTagProps {
  tag: TagUI;
  removeTag: (tag: TagUI) => void;
}

const SingleTag = ({ tag, removeTag }: SingleTagProps) => {
  return (
    <div className={css.single_tag}>
      <span className={css.tag_text}>{`#${tag.tag}`}</span>
      <div className={css.occurrances_button_container}>
        <span className={css.tag_occurrences}>{tag.occurrences}</span>
        <button className={css.remove_button} onClick={() => removeTag(tag)}>
          <img src={"/svgs/cross.svg"} />
        </button>
      </div>
    </div>
  );
};

interface SuggestedTagsProps {
  tags: TagUI[];
  searchText: string;
  hoverIndex: number;
  setHoverIndex: (index: number) => void;
  selectTag: (tag: TagUI) => void;
  canCreateTags?: boolean;
}

const SuggestedTags = ({
  tags,
  selectTag,
  searchText,
  hoverIndex,
  setHoverIndex,
  canCreateTags,
}: SuggestedTagsProps) => {
  const options = [
    ...tags.map((tag) => ({
      tag,
      onSelect: () => selectTag(tag),
    })),
    canCreateTags && {
      onSelect: () => {
        selectTag({ tag: searchText });
      },
      text: searchText,
    },
  ];

  return (
    <div className={css.suggested_tags_container}>
      {options.map(
        (option, i) =>
          option && (
            <div key={i} onMouseOver={() => setHoverIndex(i)}>
              <SingleOption option={option} highlighted={hoverIndex === i} />
            </div>
          )
      )}
    </div>
  );
};

interface SuggestedOption {
  onSelect: () => void;
  tag?: TagUI;
  text?: string;
}

interface SingleOptionProps {
  option: SuggestedOption;
  highlighted: boolean;
}

const SingleOption = ({ option, highlighted }: SingleOptionProps) => {
  return (
    <div
      onMouseDown={option.onSelect}
      onClick={option.onSelect}
      className={cn(css.single_option, highlighted && css.highlighted)}
    >
      {option.tag ? (
        <>
          <span className={css.option_text}>{option.tag.tag}</span>
          <span className={css.option_occurrances}>
            {option.tag.occurrences}
          </span>
        </>
      ) : (
        <span className={css.option_text}>{option.text}</span>
      )}
    </div>
  );
};
