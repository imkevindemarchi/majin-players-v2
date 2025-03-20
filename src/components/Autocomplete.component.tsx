import { ChangeEvent, FC, JSX, useEffect, useRef, useState } from "react";

// Spinner
import { useClickOutside } from "../hooks";

type TValue = { id: string; label: string };

interface IProps {
  value: TValue;
  onChange: (value: TValue) => void;
  icon?: JSX.Element;
  endIcon?: JSX.Element;
  placeholder: string;
  type?: "text" | "password";
  isDarkMode?: boolean;
  onSearch?: () => Promise<any>;
  width?: string;
  data: TValue[];
}

const Autocomplete: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
  isDarkMode,
  width,
  data,
}) => {
  const inputRef = useRef<any>(null);
  const [state, setState] = useState<string>(value?.label);
  const [dropdown, setDropdown] = useState<boolean>(false);

  useClickOutside(inputRef, () => {
    setDropdown(false);
    setState(value?.label);
  });

  const filteredData: TValue[] = data.filter((element: TValue) => {
    return element.label.toLowerCase().startsWith(state?.toLowerCase());
  });
  const elabData: TValue[] = state && state.trim() !== "" ? filteredData : data;

  function onBorderColorChange(): void {
    if (inputRef.current) {
      inputRef.current.style.borderColor = isDarkMode ? "#4d4d4d" : "#ececec";
    }
  }

  useEffect(() => {
    setState(value?.label);
  }, [value]);

  useEffect(() => {
    onBorderColorChange();

    // eslint-disable-next-line
  }, [isDarkMode]);

  return (
    <div
      ref={inputRef}
      className={`rounded-full border-2 px-5 py-3 transition-all duration-300 flex items-center justify-between w-96 overflow-hidde mobile:w-full relative ${
        isDarkMode
          ? "border-darkgray text-white"
          : "border-lightgray text-black"
      }`}
      style={{ width }}
    >
      <div className="flex gap-2 items-center w-full">
        {icon}
        <input
          type={type}
          value={state}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setState(event.target.value)
          }
          onFocus={() => {
            setDropdown(true);
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
      <div
        className={`absolute w-full top-0 transition-all duration-300 opacity-0 pointer-events-none rounded-lg shadow-xl ${
          dropdown && "top-14 opacity-100 pointer-events-auto overflow-hidden"
        } ${isDarkMode ? "bg-darkgray" : "bg-lightgray"}`}
        style={{
          left: "50%",
          transform: "translate(-50%, 0)",
          zIndex: "900",
        }}
      >
        {elabData.map((element: TValue, index: number) => {
          return (
            <div
              key={index}
              onClick={() => {
                onChange(element);
                setDropdown(false);
              }}
              className={`transition-all duration-300 hover:bg-primary-transparent cursor-pointer px-5 py-2 ${
                isDarkMode ? "border-darkgray3" : "border-gray"
              }`}
            >
              <span className="text-sm">{element.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Autocomplete;
