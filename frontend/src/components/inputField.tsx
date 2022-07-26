import React from "react";

const InputField: React.FC<InputFieldProps> = (props: InputFieldProps) => {
  const { type, placeholder, value, onChange, className } = props;
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`bg-black bg-opacity-70 rounded-sm mx-5 my-5  mt-3 w-80 h-12 indent-3 ${className}`}
    />
  );
};

export default InputField;

type InputFieldProps = {
  type: "email" | "password" | "text";
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  className?: string;
};
