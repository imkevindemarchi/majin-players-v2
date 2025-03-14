import { FC, ReactNode } from "react";

interface IProps {
  type?: "button" | "submit";
  children: ReactNode;
  disabled?: boolean;
  isDarkMode?: boolean;
}

const Button: FC<IProps> = ({
  type = "button",
  disabled,
  isDarkMode,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`rounded-full px-5 py-3 mobile:w-full transition-all duration-300 ${
        disabled && isDarkMode
          ? "bg-darkgray"
          : disabled
          ? "bg-lightgray"
          : "bg-primary"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
