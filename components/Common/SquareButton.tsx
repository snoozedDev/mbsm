import cn from "classname";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Nord } from "../../utils/nord";
import { NordColor, UIElementSize } from "../../utils/types";
import css from "./SquareButton.module.scss";

interface SquareButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  size: UIElementSize;
  nordBackground: NordColor;
  nordText: NordColor;
}

export const SquareButton = ({
  text,
  className,
  size,
  nordBackground,
  nordText,
  ...buttonProps
}: SquareButtonProps) => {
  return (
    <button
      style={{ backgroundColor: Nord[nordBackground], color: Nord[nordText] }}
      className={cn(css.square_button, className, css[size])}
      {...buttonProps}
    >
      {text}
    </button>
  );
};
