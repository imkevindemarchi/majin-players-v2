import { FC, JSX, useContext } from "react";

// Components
import Navbar from "./Navbar.component";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/Theme.provider";

interface IProps {
  children: JSX.Element;
}

const Layout: FC<IProps> = ({ children }) => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  const navbar: JSX.Element = <Navbar />;

  return (
    <div
      className={`transition-all duration-300 min-h-[100vh] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      {navbar}
      {children}
    </div>
  );
};

export default Layout;
