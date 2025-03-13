import { JSX, useContext } from "react";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";

// Assets
import logoImg from "../assets/images/logo.png";
import { IRoute, ROUTES } from "../routes";

// Components
import IconButton from "./IconButton.component";

// Contexts
import { ThemeContext } from "../providers";
import { SidebarContext, TSidebarContext } from "../providers/Sidebar.provider";

// Icons
import { SunIcon, MoonIcon } from "../assets/icons";

// Types
import { TThemeContext } from "../providers/Theme.provider";

const Sidebar = () => {
  const navigate: NavigateFunction = useNavigate();
  const currentPathSection: string = useLocation().pathname.split("/")[1];
  const { isDarkMode, onStateChange: onThemeChange }: TThemeContext =
    useContext(ThemeContext) as TThemeContext;
  const { isOpen, onStateChange: onSidebarStateChange }: TSidebarContext =
    useContext(SidebarContext) as TSidebarContext;

  function goToHome(): void {
    navigate("/");
    onSidebarStateChange();
  }

  const logo: JSX.Element = (
    <img
      src={logoImg}
      alt="Impossibile visualizzare l'immagine."
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
    <div
      className={`fixed left-0 w-full h-full flex justify-center items-center flex-col gap-10 desktop:hidden transition-all duration-300
        ${isDarkMode ? "bg-black" : "bg-white"}
        ${isOpen ? "top-0 opacity-100" : "top-[-100%] opacity-0"}
      `}
    >
      {logo}
      {routes}
      {themeIcon}
    </div>
  );
};

export default Sidebar;
