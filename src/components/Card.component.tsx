import React, { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  isDarkMode: boolean;
  filled?: boolean;
}

const Card: FC<IProps> = ({ isDarkMode, filled, children }) => {
  return (
    <div
      className={`p-10 rounded-lg shadow-sm w-full h-full transition-all duration-300 mobile:p-5 
        ${isDarkMode && !filled ? "bg-black" : "bg-white"}
      `}
      style={{
        background: filled
          ? "linear-gradient(to right,  #f37c90 50%, #f3a67c 100%)"
          : "",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
