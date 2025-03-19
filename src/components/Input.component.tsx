import { ChangeEvent, FC, JSX, useEffect, useRef, useState } from "react";

// Spinner
import { ClipLoader as Spinner } from "react-spinners";

interface IProps {
  value: string | null;
  onChange: (value: string) => void;
  icon?: JSX.Element;
  endIcon?: JSX.Element;
  placeholder: string;
  type?: "text" | "password";
  isDarkMode?: boolean;
  onSearch?: () => Promise<any>;
  width?: string;
}

const Input: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
  isDarkMode,
  onSearch,
  width,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isValueChanged, setIsValueChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeOut: NodeJS.Timeout = setTimeout(async () => {
      if (isValueChanged && onSearch) {
        await onSearch();
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeOut);

    // eslint-disable-next-line
  }, [value]);

  return (
    <div className="flex flex-row items-center gap-2" style={{ width }}>
      <div
        ref={inputRef}
        className={`rounded-full border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full ${
          isDarkMode
            ? "border-darkgray text-white"
            : "border-lightgray text-black"
        }`}
      >
        <div className="flex gap-2 items-center w-full">
          {icon}
          <input
            type={type}
            value={value || ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange(event.target.value);
              if (onSearch) {
                setIsValueChanged(true);
                setIsLoading(true);
              }
            }}
            onFocus={() => {
              if (inputRef.current) {
                inputRef.current.style.borderColor = process.env
                  .REACT_APP_PRIMARY_COLOR as string;
              }
            }}
            onBlur={() => {
              if (inputRef.current) {
                inputRef.current.style.borderColor = isDarkMode
                  ? "#4d4d4d"
                  : "#ececec";
              }
            }}
            placeholder={placeholder}
            style={{ backgroundColor: "transparent" }}
            className="border-none outline-none text-base w-full"
          />
        </div>
        {endIcon}
        {isLoading && (
          <Spinner
            size={20}
            color={process.env.REACT_APP_PRIMARY_COLOR}
            className="ml-2"
          />
        )}
      </div>
    </div>
  );
};

export default Input;
