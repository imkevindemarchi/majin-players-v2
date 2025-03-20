import { ChangeEvent, FC, JSX, useEffect, useRef, useState } from "react";

// Spinner
import { ClipLoader as Spinner } from "react-spinners";

interface IProps {
  value: string | null;
  onChange: (value: string) => void;
  icon?: JSX.Element;
  endIcon?: JSX.Element;
  placeholder: string;
  isDarkMode?: boolean;
  onSearch?: () => Promise<any>;
  width?: string;
}

const Textarea: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
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

  function onBorderColorChange(): void {
    if (inputRef.current) {
      inputRef.current.style.borderColor = isDarkMode ? "#4d4d4d" : "#ececec";
    }
  }

  useEffect(() => {
    onBorderColorChange();

    // eslint-disable-next-line
  }, [isDarkMode]);

  return (
    <div
      ref={inputRef}
      className={`rounded-xl border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full ${
        isDarkMode
          ? "border-darkgray text-white"
          : "border-lightgray text-black"
      }`}
      style={{ width }}
    >
      <div className="flex gap-2 items-center w-full">
        {icon}
        <textarea
          value={value || ""}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
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
  );
};

export default Textarea;
