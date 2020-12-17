import { CircleLoader } from "../Loading/CircleLoader";
import css from "./ScreenLoader.module.scss";

export const ScreenLoader = () => {
  return (
    <div className={css.screen_loader}>
      <CircleLoader height={100} />
    </div>
  );
};
