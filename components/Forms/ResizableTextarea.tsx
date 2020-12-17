import cn from "classname";
import TextareaAutosize from "react-textarea-autosize";
import { Nord } from "../../utils/nord";
import { colorBlender } from "../../utils/utils";
import css from "./ResizableTextarea.module.scss";

interface ResizableTextareaProps {
  value: string;
  setValue: (newValue: string) => void;
  tabIndex?: number;
  readOnly?: boolean;
  spellCheck?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  disableNewLine?: boolean;
}

export const ResizableTextarea = ({
  value,
  setValue,
  className,
  containerClassName,
  placeholder,
  readOnly,
  disableNewLine,
  tabIndex = -1,
  minRows = 5,
  maxRows = 15,
  maxLength = 32,
  spellCheck = true,
}: ResizableTextareaProps) => {
  const handleChange = (event) => {
    const value = disableNewLine
      ? event.target.value.replace(/\n/g, "")
      : event.target.value;
    setValue(value);
  };

  const limitColor = colorBlender(
    Nord[4],
    Nord[11],
    ((value.length * 0.5) / maxLength - 0.4) * 10
  );
  const limitOpacity =
    (value.length * 0.5) / maxLength > 0.3
      ? `${((value.length * 0.5) / maxLength - 0.4) * 10}`
      : undefined;

  return (
    <div className={cn(css.textarea_container, containerClassName)}>
      <TextareaAutosize
        readOnly={readOnly}
        placeholder={placeholder}
        minRows={minRows}
        maxRows={maxRows}
        className={className}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        tabIndex={tabIndex}
        spellCheck={spellCheck}
      />
      {maxLength * 0.78 < value.length && (
        <div
          className={css.bar}
          style={{
            width: `${(value.length * 100) / maxLength}%`,
            backgroundColor: limitColor,
            opacity: limitOpacity,
          }}
        >
          <span
            className={css.bar_text}
          >{`${value.length} / ${maxLength}`}</span>
        </div>
      )}
    </div>
  );
};
