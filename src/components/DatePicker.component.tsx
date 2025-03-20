import { FC, JSX, useEffect, useRef, useState } from "react";
import { Calendar, DateValue } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { I18nProvider } from "@react-aria/i18n";

// Hoos
import { useClickOutside } from "../hooks";

// Utils
import { formatDateFromDb } from "../utils";

interface IProps {
  value: DateValue | null;
  onChange: (value: DateValue) => void;
  icon?: JSX.Element;
  endIcon?: JSX.Element;
  placeholder: string;
  type?: "text" | "password";
  isDarkMode?: boolean;
  width?: string;
}

const DatePicker: FC<IProps> = ({
  value,
  onChange,
  icon,
  placeholder,
  endIcon,
  type = "text",
  isDarkMode,
  width,
}) => {
  const inputRef = useRef<any>(null);
  const [state, setState] = useState<string | null>(
    formatDateFromDb(value as DateValue)
  );
  const [dropdown, setDropdown] = useState<boolean>(false);

  const {
    i18n: { language: currentLanguage },
  } = useTranslation();

  const locale: string = `${currentLanguage}-${currentLanguage.toUpperCase()}-u-ca`;

  useClickOutside(inputRef, () => {
    setDropdown(false);
  });

  function onBorderColorChange(): void {
    if (inputRef.current) {
      inputRef.current.style.borderColor = isDarkMode ? "#4d4d4d" : "#ececec";
    }
  }

  useEffect(() => {
    onBorderColorChange();

    // eslint-disable-next-line
  }, [isDarkMode]);

  useEffect(() => {
    setState(formatDateFromDb(value as DateValue));
  }, [value]);

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
          value={state as string}
          readOnly
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
        className={`absolute overflow-hidden top-0 transition-all duration-300 opacity-0 pointer-events-none rounded-lg shadow-xl mobile:w-[40vh] ${
          dropdown && "top-14 opacity-100 pointer-events-auto overflow-hidden"
        } ${isDarkMode ? "bg-darkgray" : "bg-lightgray"}`}
        style={{
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        <I18nProvider locale={locale}>
          <Calendar
            value={value}
            onChange={(value: DateValue) => {
              setDropdown(false);
              onChange(value);
            }}
            showMonthAndYearPickers
          />
        </I18nProvider>
      </div>
    </div>
  );
};

export default DatePicker;
