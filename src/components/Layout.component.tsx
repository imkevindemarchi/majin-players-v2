import { FC, JSX, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

// Components
import Navbar from "./Navbar.component";
import Hamburger from "./Hamburger.component";
import Sidebar from "./Sidebar.component";
import Popup from "./Popup.component";
import Loader from "./Loader.component";
import BackToTopButton from "./BackToTopButton.component";

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
  const [is404Path, setIs404Path] = useState<boolean>(false);

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

  const loader: JSX.Element = <Loader isDarkMode={isDarkMode} />;

  const layout: JSX.Element = (
    <div
      className={`transition-all duration-300 min-h-[100vh] relative w-full h-full pb-40 ${
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
        <div className="px-60 py-10 h-full mobile:px-5 mobile:py-24">
          {children}
        </div>
      </div>
    </div>
  );

  const backToTopButton: JSX.Element = (
    <BackToTopButton isDarkMode={isDarkMode} />
  );

  useEffect(() => {
    const currentPageTitle: string = document.title.split("-")[1];
    const is404Path: boolean = currentPageTitle?.trim() === "404";
    setIs404Path(is404Path);

    // eslint-disable-next-line
  }, [document.title]);

  return (
    <div className="w-full h-full relative">
      {isLoginPage ? loginLayout : !is404Path ? layout : children}
      {loader}
      {popup}
      {backToTopButton}
    </div>
  );
};

export default Layout;
