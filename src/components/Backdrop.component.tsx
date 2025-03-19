import React, { FC, ReactNode } from "react";

interface IProps {
  isDarkMode: boolean;
  children: ReactNode;
}

const Backdrop: FC<IProps> = ({ isDarkMode, children }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${
        isDarkMode ? "bg-white-transparent" : "bg-black-transparent"
      }`}
    >
      {children}
    </div>
  );
};

export default Backdrop;
