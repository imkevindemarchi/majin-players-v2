import React, { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  isDarkMode: boolean;
  filled?: boolean;
  visibleBackground?: boolean;
}

const Card: FC<IProps> = ({
  isDarkMode,
  filled,
  visibleBackground,
  children,
}) => {
  return (
    <div
      className={`p-10 rounded-lg shadow-sm w-full h-full transition-all duration-300 mobile:p-5
        ${
          !filled &&
          (isDarkMode && visibleBackground
            ? "bg-darkgray"
            : visibleBackground
            ? "bg-lightgray"
            : isDarkMode
            ? "bg-black"
            : "bg-white")
        }
      `}
      style={{
        background: filled
          ? `linear-gradient(to right,  ${process.env.REACT_APP_PRIMARY_COLOR} 50%, ${process.env.REACT_APP_SECONDARY_COLOR} 100%)`
          : "",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
