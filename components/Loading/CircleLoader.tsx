import css from "./CircleLoader.module.scss";

interface CircleLoaderProps {
  height?: number;
}

export const CircleLoader = ({ height }: CircleLoaderProps) => {
  return (
    <svg
      className={css.svg}
      style={{
        height,
        width: height,
      }}
      viewBox="0 0 100 100"
    >
      <circle className={css.circle} cx="50" cy="50" r="40" />
      <circle className={css.animated_circle} cx="50" cy="50" r="40" />
    </svg>
  );
};
