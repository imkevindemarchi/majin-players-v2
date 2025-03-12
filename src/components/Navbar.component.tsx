import { FC, JSX, useContext } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";

// Assets
import logoImg from "../assets/images/logo.png";
import { IRoute, ROUTES } from "../routes";

// Components
import IconButton from "./IconButton.component";

// Contexts
import { ThemeContext } from "../providers";

// Icons
import { SunIcon, MoonIcon } from "../assets/icons";

// Types
import { TThemeContext } from "../providers/Theme.provider";

const Navbar: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const currentPathSection: string = useLocation().pathname.split("/")[1];
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;

  function goToHome(): void {
    navigate("/");
  }

  const logo: JSX.Element = (
    <img
      src={logoImg}
      alt="Impossibile visualizzare l'immagine."
      className="w-full h-full cursor-pointer hover:opacity-50 transition-all duration-300 mobile:w-auto"
      onClick={goToHome}
    />
  );

  const routes: JSX.Element = (
    <div className="flex mobile:hidden">
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
                {route.name}
              </span>
            </Link>
          )
        );
      })}
    </div>
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
    <div className="w-full h-32 flex items-center px-10 justify-between py-2 mobile:justify-center mobile:items-center mobile:px-0">
      <div className="h-full flex justify-center items-center">
        <div className="h-full w-full flex items-center gap-10">
          {logo}
          {routes}
        </div>
      </div>
      <div className="bg-slate-600 h-full flex justify-center items-center mobile:hidden">
        {themeIcon}
      </div>
    </div>
  );
};

export default Navbar;
