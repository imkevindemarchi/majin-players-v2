// Pages
import { ReactNode } from "react";
import { Login, Home } from "./pages";

export type IRoute = {
  path: string;
  name: string;
  element: ReactNode;
  isHidden?: boolean;
};

export const ROUTES: IRoute[] = [
  {
    path: "/log-in",
    name: "Log In",
    element: <Login />,
    isHidden: true,
  },
  {
    path: "/",
    name: "Home",
    element: <Home />,
    isHidden: true,
  },
  {
    path: "/players",
    name: "players",
    element: <Home />,
  },
  {
    path: "/equipments",
    name: "equipments",
    element: <Home />,
  },
  {
    path: "/sponsors",
    name: "sponsors",
    element: <Home />,
  },
  {
    path: "/contacts",
    name: "contacts",
    element: <Home />,
  },
];
