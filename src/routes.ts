import { JSX } from "react";

// Pages
import { Home } from "./pages";

export type IRoute = {
  path: string;
  name: string;
  element: () => JSX.Element;
  isHidden?: boolean;
};

export const ROUTES: IRoute[] = [
  {
    path: "/",
    name: "Home",
    element: Home,
    isHidden: true,
  },
  {
    path: "/players",
    name: "Giocatori",
    element: Home,
  },
  {
    path: "/equipments",
    name: "Equipaggiamenti",
    element: Home,
  },
  {
    path: "/sponsors",
    name: "Sponsor",
    element: Home,
  },
  {
    path: "/contacts",
    name: "Contatti",
    element: Home,
  },
];
