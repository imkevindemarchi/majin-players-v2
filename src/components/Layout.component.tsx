import { FC, JSX, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

// Components
import Navbar from "./Navbar.component";
import Hamburger from "./Hamburger.component";
import Sidebar from "./Sidebar.component";
import Popup from "./Popup.component";
import Loader from "./Loader.component";
import BackToTopButton from "./BackToTopButton.component";
import Footer from "./Footer.component";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { SidebarContext, TSidebarContext } from "../providers/sidebar.provider";

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
  const { pathname } = useLocation();
  const currentPathSection: string = pathname.split("/")[1];
  const [is404Path, setIs404Path] = useState<boolean>(false);

  const isLoginPage: boolean = currentPathSection === "log-in";
  const isAdminSection: boolean = currentPathSection === "admin";

  const navbar: JSX.Element = <Navbar isAdminSection={isAdminSection} />;

  const hamburger: JSX.Element = (
    <Hamburger
      onClick={onSidebarStateChange}
      isActive={isSidebarOpen}
      isDarkMode={isDarkMode}
    />
  );

  const sidebar: JSX.Element = <Sidebar isAdminSection={isAdminSection} />;

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

  const footer: JSX.Element = <Footer />;

  const layout: JSX.Element = (
    <div
      className={`transition-all duration-300 min-h-[100vh] relative w-full h-full ${
        isAdminSection ? "pb-0" : "pb-80 mobile:pb-[90vh]"
      } ${
        isDarkMode && isAdminSection
          ? "bg-darkgray3"
          : isAdminSection
          ? "bg-lightgray2"
          : isDarkMode
          ? "bg-black"
          : "bg-white"
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
        <div className="px-60 py-10 pb-40 h-full mobile:px-5 mobile:py-24">
          {children}
        </div>
      </div>
      {!isAdminSection && footer}
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
  }, [document.title, pathname]);

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
