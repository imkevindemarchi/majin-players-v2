import { FC, JSX, useContext } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

// Assets
import logoImg from "../assets/images/logo.png";
import { IRoute, ROUTES } from "../routes";

// Components
import IconButton from "./IconButton.component";
import LanguageSelector from "./LanguageSelector.component";

// Contexts
import { ThemeContext } from "../providers";

// Icons
import { SunIcon, MoonIcon } from "../assets/icons";

// Types
import { TThemeContext } from "../providers/Theme.provider";

// Utils
import { setToStorage } from "../utils";

const Navbar: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const currentPathSection: string = useLocation().pathname.split("/")[1];
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  function goToHome(): void {
    navigate("/");
  }

  const logo: JSX.Element = (
    <img
      src={logoImg}
      alt={t("imgNotFound")}
      className="w-full h-full cursor-pointer hover:opacity-50 transition-all duration-300 mobile:w-auto"
      onClick={goToHome}
    />
  );

  const routes: JSX.Element = (
    <div className="flex">
      {ROUTES.map((route: IRoute, index: number) => {
        const isRouteHidden: boolean = route.isHidden ? true : false;
        const routePathSection: string = route.path.split("/")[1];
        const isRouteActive: boolean = routePathSection === currentPathSection;

        return (
          !isRouteHidden && (
            <Link
              to={route.path}
              key={index}
              className={`px-4 py-2 transition-all duration-300 ${
                isRouteActive ? "bg-primary" : "bg-none"
              }
              ${
                isRouteActive
                  ? "hover:cursor-default"
                  : "hover:bg-primary-transparent"
              }`}
            >
              <span
                className={`uppercase font-bold text-lg transition-all duration-300 ${
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

  return (
    <div className="w-full h-32 flex items-center px-10 justify-between py-2 mobile:justify-center mobile:items-center mobile:px-0 mobile:hidden">
      <div className="h-full flex justify-center items-center">
        <div className="h-full w-full flex items-center gap-10">
          {logo}
          {routes}
        </div>
      </div>
      <div className="h-full flex items-center gap-5">
        {languageSelector}
        {themeIcon}
      </div>
    </div>
  );
};

export default Navbar;
