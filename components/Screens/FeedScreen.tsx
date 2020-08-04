import cn from "classnames";
import jimp from "jimp";
import Router from "next/router";
import { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import { getFeed } from "../../redux/actions/feed";
import { store } from "../../redux/store";
import { createPost, logout, uploadAvatar } from "../../utils/api";
import { TextPost } from "../../utils/types";
import { Modal } from "../Containers/Modal";
import { ResizableTextarea } from "../Forms/ResizableTextarea";
import { CircleLoader } from "../Loading/CircleLoader";
import css from "./FeedScreen.module.scss";
import { CreatePostForm } from "../Forms/CreatePostForm";
import { PostAvatar } from "../Common/PostAvatar";
import { PostAuthor } from "../Common/PostAuthor";

interface FeedScreenProps {
  posts: TextPost[];
  loading: boolean;
  onFeedRefresh: () => void;
}

export const FeedScreen = ({
  posts,
  loading,
  onFeedRefresh,
}: FeedScreenProps) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);

  const onHome = () => {
    feedRef.current.scrollIntoView({ behavior: "smooth" });
    onFeedRefresh();
  };

  const onLogout = async () => {
    const result = await logout();
    if (result.success) Router.push("/login");
  };
  return (
    <div className={css.screen}>
      <div className={css.sidebar}>
        <button
          onClick={onHome}
          className={cn(css.sidebar_button, css.home_button)}
        />
        <Modal
          showModal={showPostModal}
          onHideModal={() => setShowPostModal(false)}
          renderButton={() => (
            <button
              className={css.sidebar_button}
              onClick={() => setShowPostModal(true)}
            />
          )}
          renderModal={(onHideModal) => (
            <TextPostFormModal onHideModal={onHideModal} />
          )}
        />
        <Modal
          showModal={showAvatarModal}
          onHideModal={() => setShowAvatarModal(false)}
          renderButton={() => (
            <button
              onClick={() => setShowAvatarModal(true)}
              className={cn(css.sidebar_button, css.avatar_button)}
            />
          )}
          renderModal={(onHideModal) => (
            <AvatarModal onHideModal={onHideModal} />
          )}
        />

        <button
          onClick={onLogout}
          className={cn(css.sidebar_button, css.logout_button)}
        />
      </div>

      <div className={css.feed_container}>
        <div ref={feedRef} className={css.feed}>
          <div className={cn(css.loading_container, loading && css.show)}>
            <CircleLoader />
          </div>
          <CreatePostForm />
          {posts.map((post, i) => (
            <TextPostComponent key={i} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TextPostComponentProps {
  post: TextPost;
}

const TextPostComponent = ({ post }: TextPostComponentProps) => {
  return (
    <div className={css.post_container}>
      <PostAvatar avatar={post.author.avatar} />
      <PostAuthor live author={post.author} time={post.created_at} />
      {post.title && <span className={css.post_title}>{post.title}</span>}
      {post.body && <span className={css.post_description}>{post.body}</span>}
      <div className={css.post_tag_container}>
        {post.tags.map((tag, i) => (
          <a key={i} className={css.post_tag}>{`#${tag}`}</a>
        ))}
      </div>
    </div>
  );
};

const TextPostFormModal = ({ onHideModal }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const onDiscard = () => {
    setTitle("");
    setBody("");
    setTags("");
    onHideModal();
  };

  const onPost = async () => {
    setLoading(true);
    const result = await createPost({
      title,
      body,
      tags,
    });
    if (result.success) {
      getFeed()(store.dispatch);
      onDiscard();
    } else {
      console.log(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={css.post_form_container}>
      <ResizableTextarea
        readOnly={loading}
        className={css.form_title}
        value={title}
        minRows={1}
        maxRows={2}
        setValue={setTitle}
        placeholder="TITLE (optional)"
        tabIndex={1}
        textareaLineHeight={28}
        maxLength={72}
        disableNewLine
      />
      <ResizableTextarea
        readOnly={loading}
        className={css.form_body}
        value={body}
        setValue={setBody}
        maxRows={40}
        placeholder="BODY"
        textareaLineHeight={22}
        tabIndex={2}
        maxLength={1024}
      />
      <ResizableTextarea
        readOnly={loading}
        className={css.form_tags}
        value={tags}
        setValue={setTags}
        minRows={1}
        maxRows={2}
        placeholder="TAGS (separated by spaces)"
        tabIndex={2}
        maxLength={256}
        textareaLineHeight={16}
        spellCheck={false}
        disableNewLine
      />
      <div className={css.buttons_container}>
        <button
          onClick={onDiscard}
          className={cn(css.form_button, css.cancel)}
          tabIndex={3}
        >
          DISCARD
        </button>
        <button onClick={onPost} className={css.form_button} tabIndex={4}>
          POST
        </button>
      </div>
    </div>
  );
};

const AvatarModal = ({ onHideModal }) => {
  const [src, setSrc] = useState<string>(null);
  const [onDrag, setOnDrag] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: "%", aspect: 1 });
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState(false);
  const [maxImageWidth, setMaxImageWidth] = useState(0);

  const cropper = useRef(null);

  const onImage = async (evt) => {
    setLoading(true);
    setError(null);
    const files = evt.target.files;

    if (files && files.length) {
      let fr = new FileReader();
      fr.onload = async () => {
        try {
          const image = await jimp.read(fr.result as string);
          await image.resize(
            500,
            (500 * image.bitmap.height) / image.bitmap.width
          );
          if (image.bitmap.height > 400)
            await image.resize(
              (400 * image.bitmap.width) / image.bitmap.height,
              400
            );
          const taller = image.bitmap.height > image.bitmap.width;

          const width = taller
            ? 100
            : (image.bitmap.height * 100) / image.bitmap.width;
          const height = taller
            ? (image.bitmap.width * 100) / image.bitmap.height
            : 100;

          const crop: Crop = {
            aspect: 1,
            unit: "%",
            width,
            height,
            x: taller ? 0 : 50 - width / 2,
            y: taller ? 50 - height / 2 : 0,
          };
          const src = await image.getBase64Async(jimp.MIME_PNG);
          setMaxImageWidth(image.getWidth());
          setSrc(src);
          setCrop(crop);
        } catch (e) {
          setError("Unsupported file.");
        }
        setLoading(false);
      };
      fr.readAsDataURL(files[0]);
    }
  };

  const onDiscard = () => {
    setError(null);
    setSrc(null);
    setCrop({ aspect: 1 });
  };

  const onCancel = () => {
    setError(null);
    onHideModal();
  };

  const onUpload = async () => {
    setLoading(true);
    try {
      const image = await jimp.read(src);
      await image.crop(crop.x, crop.y, crop.width, crop.height);
      let formData = new FormData();

      const file = await fetch(await image.getBase64Async(jimp.MIME_PNG));
      await formData.append("file", await file.blob());
      const result = await uploadAvatar(formData);
      setSrc(null);
      if (result.success) {
        Router.reload();
        onHideModal();
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  console.log();

  return (
    <div className={css.avatar_container}>
      <div className={css.section_container}>
        {!loading && <span className={css.avatar_title}>CHANGE AVATAR</span>}
        {!src && !loading && (
          <>
            <input
              className={css.avatar_input}
              type="file"
              name="file"
              id="file"
              onChange={onImage}
              style={{}}
              onDrop={onImage}
            />
            <label
              onDragEnter={() => setOnDrag(true)}
              onDragLeave={() => setOnDrag(false)}
              className={cn(css.avatar_label, onDrag && css.on_drag)}
              htmlFor="file"
            >
              drag image here or click choose
            </label>
            <span className={cn(css.avatar_error, error && css.show)}>
              {error}
            </span>
            <button
              onClick={onCancel}
              className={cn(css.form_button, css.cancel)}
              tabIndex={1}
            >
              CANCEL
            </button>
          </>
        )}
        {src && !loading && (
          <>
            <div ref={cropper}>
              <ReactCrop
                className={css.cropper}
                src={src}
                crop={crop}
                onChange={(crop) => setCrop(crop)}
              />
            </div>

            <div className={css.preview_container}>
              <div className={css.preview_image} style={{}}>
                <img
                  style={{
                    position: "absolute",
                    top: (-crop.y * 64) / crop.height,
                    left: (-crop.x * 64) / crop.height,
                    transformOrigin: "top left",
                    transform: `scale(${
                      (64 / crop.height) *
                      (cropper.current &&
                        cropper.current.clientWidth / maxImageWidth)
                    })`,
                  }}
                  src={src}
                />
              </div>
            </div>
            <div className={css.buttons_container}>
              <button
                onClick={onDiscard}
                className={cn(css.form_button, css.cancel)}
                tabIndex={1}
              >
                DISCARD
              </button>
              <button
                onClick={onUpload}
                className={cn(css.form_button)}
                tabIndex={1}
              >
                UPLOAD
              </button>
            </div>
          </>
        )}
        {loading && (
          <div className={css.avatar_loader}>
            <CircleLoader height={96} />
          </div>
        )}
      </div>
    </div>
  );
};
