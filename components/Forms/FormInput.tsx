import React from "react";

interface FormInputProps {
  value: string;
  setValue: (newValue: string) => void;
  tabIndex?: number;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
  type?: string;
}

export const FormInput = ({
  value,
  setValue,
  className,
  placeholder,
  readOnly,
  tabIndex = -1,
  type = "text",
}: FormInputProps) => {
  return (
    <input
      readOnly={readOnly}
      tabIndex={tabIndex}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
};
