import { FC, JSX, useContext } from "react";

// Components
import Navbar from "./Navbar.component";
import Hamburger from "./Hamburger.component";
import Sidebar from "./Sidebar.component";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/Theme.provider";
import { SidebarContext, TSidebarContext } from "../providers/Sidebar.provider";
import { useLocation } from "react-router";

interface IProps {
  children: JSX.Element;
}

const Layout: FC<IProps> = ({ children }) => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const {
    isOpen: isSidebarOpen,
    onStateChange: onSidebarStateChange,
  }: TSidebarContext = useContext(SidebarContext) as TSidebarContext;
  const currentPathSection: string = useLocation().pathname.split("/")[1];

  const isLoginPage: boolean = currentPathSection === "log-in";

  const navbar: JSX.Element = <Navbar />;

  const hamburger: JSX.Element = (
    <Hamburger
      onClick={onSidebarStateChange}
      isActive={isSidebarOpen}
      isDarkMode={isDarkMode}
    />
  );

  const sidebar: JSX.Element = <Sidebar />;

  const loginLayout: JSX.Element = (
    <div
      className={`transition-all duration-300 min-h-[100vh] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      {children}
    </div>
  );

  const layout: JSX.Element = (
    <div
      className={`transition-all duration-300 min-h-[100vh] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      {navbar}
      {hamburger}
      {sidebar}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen && "opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );

  return isLoginPage ? loginLayout : layout;
};

export default Layout;
