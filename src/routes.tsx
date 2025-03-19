import { ReactNode } from "react";

// Pages
import { Dashboard, AdminPlayers } from "./pages/admin";
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
    name: "login",
    element: <Login />,
    isHidden: true,
  },
  {
    path: "/",
    name: "home",
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

export const ADMIN_ROUTES: IRoute[] = [
  {
    path: "/admin",
    name: "dashboard",
    element: <Dashboard />,
    isHidden: true,
  },
  {
    path: "/admin/players",
    name: "players",
    element: <AdminPlayers />,
  },
];
