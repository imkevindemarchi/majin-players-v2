import { FC, MouseEventHandler } from "react";

interface IProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: any;
}

const IconButton: FC<IProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full p-3 hover:opacity-50 bg-primary-transparent transition-all duration-300"
    >
      {children}
    </button>
  );
};

export default IconButton;
