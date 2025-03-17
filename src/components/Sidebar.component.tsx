import { FC, JSX, useContext } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

// Api
import { AUTH_API } from "../api";

// Assets
import logoImg from "../assets/images/logo.png";
import { IRoute, ROUTES } from "../routes";

// Components
import IconButton from "./IconButton.component";
import LanguageSelector from "./LanguageSelector.component";

// Contexts
import { ThemeContext } from "../providers";
import { SidebarContext, TSidebarContext } from "../providers/Sidebar.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { AuthContext, TAuthContext } from "../providers/auth.provider";
import { PopupContext, TPopupContext } from "../providers/Popup.provider";

// Icons
import { SunIcon, MoonIcon, LogoutIcon } from "../assets/icons";

// Types
import { TThemeContext } from "../providers/Theme.provider";
import { THTTPResponse } from "../types";

// Utils
import { removeFromStorage, setToStorage } from "../utils";

const Sidebar: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;
  const { isOpen, onStateChange: onSidebarStateChange }: TSidebarContext =
    useContext(SidebarContext) as TSidebarContext;
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { setIsUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  const currentPathSection: string = useLocation().pathname.split("/")[1];
  const isAdminSection: boolean = currentPathSection.split("/")[0] === "admin";

  function goToHome(): void {
    navigate(isAdminSection ? "/admin" : "/");
    onSidebarStateChange();
  }

  const logo: JSX.Element = (
    <img
      src={logoImg}
      alt={t("imgNotFound")}
      className="w-32"
      onClick={goToHome}
    />
  );

  const routes: JSX.Element = (
    <div className="flex flex-col justify-center items-center">
      {ROUTES.map((route: IRoute, index: number) => {
        const isRouteHidden: boolean = route.isHidden ? true : false;
        const routePathSection: string = route.path.split("/")[1];
        const isRouteActive: boolean = routePathSection === currentPathSection;

        return (
          !isRouteHidden && (
            <Link
              to={route.path}
              onClick={!isRouteActive ? () => onSidebarStateChange() : () => {}}
              key={index}
              className={`px-4 py-2 rounded-lg w-full flex justify-center ${
                isRouteActive ? "bg-primary" : "bg-none"
              } 
              ${
                isRouteActive
                  ? "hover:cursor-default"
                  : "hover:bg-primary-transparent"
              }`}
            >
              <span
                className={`uppercase text-2xl font-bold ${
                  isRouteActive ? "text-white" : "text-primary"
                }`}
              >
                {t(route.name)}
              </span>
            </Link>
          )
        );
      })}
    </div>
  );

  function onLanguageChange(countryCode: string): void {
    changeLanguage(countryCode);
    setToStorage("language", countryCode);
  }

  const languageSelector: JSX.Element = (
    <LanguageSelector
      value={language}
      onChange={onLanguageChange}
      isDarkMode={isDarkMode}
    />
  );

  const themeIcon: JSX.Element = (
    <IconButton onClick={onThemeChange}>
      {isDarkMode ? (
        <MoonIcon className="text-primary text-2xl" />
      ) : (
        <SunIcon className="text-primary text-2xl" />
      )}
    </IconButton>
  );

  async function onLogout() {
    setIsLoading(true);

    await Promise.resolve(AUTH_API.logout()).then((response: THTTPResponse) => {
      if (response.hasSuccess) {
        navigate("/log-in");
        removeFromStorage("token");
        setIsUserAuthenticated(false);
      } else openPopup(t("logoutError"), "error");
    });
    onSidebarStateChange();

    setIsLoading(false);
  }

  const logoutIcon: JSX.Element = (
    <LogoutIcon
      onClick={onLogout}
      className="text-primary text-2xl cursor-pointer hover:opacity-50 transition-all duration-300"
    />
  );

  return (
    <div
      className={`fixed left-0 w-full h-full flex justify-center items-center flex-col gap-10 desktop:hidden transition-all duration-300
        ${isDarkMode ? "bg-black" : "bg-white"}
        ${isOpen ? "top-0 opacity-100" : "top-[-100%] opacity-0"}
      `}
      style={{ zIndex: "900" }}
    >
      {logo}
      {routes}
      {languageSelector}
      <div className="flex gap-5 items-center">
        {themeIcon}
        {isAdminSection && logoutIcon}
      </div>
    </div>
  );
};

export default Sidebar;
