import { ChangeEvent, FC, JSX, useRef } from "react";

interface IProps {
  value: string | null;
  onChange: (value: string) => void;
  icon: JSX.Element;
  endIcon?: JSX.Element;
  placeholder: string;
  type?: "text" | "password";
}

const Input: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={inputRef}
      className="rounded-full border-lightgray border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full"
    >
      <div className="flex gap-2 items-center w-full">
        {icon}
        <input
          type={type}
          value={value || ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
          onFocus={() => {
            if (inputRef.current) {
              inputRef.current.style.borderColor = "#f37c90";
            }
          }}
          onBlur={() => {
            if (inputRef.current) {
              inputRef.current.style.borderColor = "#ececec";
            }
          }}
          placeholder={placeholder}
          style={{ backgroundColor: "transparent" }}
          className="border-none outline-none text-base w-full"
        />
      </div>
      {endIcon}
    </div>
  );
};

export default Input;
