import { useState, useEffect, useRef } from "react";
import css from "./ResizableTextarea.module.scss";
import { colorBlender } from "../../utils/utils";
import { Nord } from "../../utils/nord";

interface ResizableTextareaProps {
  value: string;
  setValue: (newValue: string) => void;
  tabIndex?: number;
  readOnly?: boolean;
  spellCheck?: boolean;
  className?: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  padding?: number;
  maxLength?: number;
  disableNewLine?: boolean;
}

export const ResizableTextarea = ({
  value,
  setValue,
  className,
  placeholder,
  readOnly,
  disableNewLine,
  tabIndex = -1,
  minRows = 5,
  maxRows = 15,
  padding = 8,
  maxLength = 32,
  spellCheck = true,
}: ResizableTextareaProps) => {
  const [rows, setRows] = useState(minRows);
  const [height, setHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const textarea = useRef<any>();
  const verticalPadding = padding * 2;

  useEffect(() => {
    if (!textarea.current) return;
    calculateTextArea(true);
  }, [textarea]);

  useEffect(() => {
    calculateTextArea();
  }, [height]);

  const calculateTextArea = (first = false) => {
    if (first) setLineHeight(textarea.current.scrollHeight - verticalPadding);
    const rows = (textarea.current.scrollHeight - verticalPadding) / lineHeight;
    setHeight(
      rows < minRows
        ? lineHeight * minRows + verticalPadding
        : rows > maxRows
        ? lineHeight * maxRows + verticalPadding
        : lineHeight * rows + verticalPadding
    );
  };

  const handleChange = (event) => {
    const value = disableNewLine
      ? event.target.value.replace(/\n/g, "")
      : event.target.value;
    setHeight(0);
    setValue(value);
  };

  return (
    <div className={css.textarea_container}>
      <textarea
        ref={textarea}
        style={{
          height,
        }}
        maxLength={maxLength}
        readOnly={readOnly}
        rows={rows}
        value={value}
        tabIndex={tabIndex}
        placeholder={placeholder}
        className={className}
        onChange={handleChange}
        spellCheck={spellCheck}
      />
      <div
        className={css.bar}
        style={{
          width: `${(value.length * 100) / maxLength}%`,
          backgroundColor: `${colorBlender(
            Nord[4],
            Nord[11],
            ((value.length * 0.5) / maxLength - 0.4) * 10
          )}`,
          opacity:
            (value.length * 0.5) / maxLength > 0.3
              ? `${((value.length * 0.5) / maxLength - 0.4) * 10}`
              : undefined,
        }}
      >
        <span
          className={css.bar_text}
          style={{
            color: `${colorBlender(
              Nord[4],
              Nord[11],
              ((value.length * 0.5) / maxLength - 0.4) * 10
            )}`,
          }}
        >{`${value.length} / ${maxLength}`}</span>
      </div>
    </div>
  );
};
