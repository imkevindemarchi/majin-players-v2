import { FC, JSX, useContext } from "react";
import { useLocation } from "react-router";

// Components
import Navbar from "./Navbar.component";
import Hamburger from "./Hamburger.component";
import Sidebar from "./Sidebar.component";
import Popup from "./Popup.component";
import Loader from "./Loader.component";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/Theme.provider";
import { SidebarContext, TSidebarContext } from "../providers/Sidebar.provider";

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

  const popup: JSX.Element = <Popup />;

  const loader: JSX.Element = <Loader />;

  const layout: JSX.Element = (
    <div
      className={`transition-all duration-300 min-h-[100vh] relative w-full h-full ${
        isDarkMode ? "bg-darkgray3" : "bg-lightgray2"
      }`}
    >
      {navbar}
      {hamburger}
      {sidebar}
      <div
        className={`transition-all duration-300 w-full h-full ${
          isSidebarOpen && "opacity-0"
        }`}
      >
        <div className="px-60 py-10 h-full mobile:px-5 mobile:py-20">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      {isLoginPage ? loginLayout : layout}
      {loader}
      {popup}
    </div>
  );
};

export default Layout;
