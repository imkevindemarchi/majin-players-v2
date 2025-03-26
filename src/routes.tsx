import { ReactNode } from "react";

// Pages
import {
  Dashboard,
  AdminPlayers,
  AdminPlayer,
  AdminDecks,
  AdminDeck,
  AdminTournaments,
  AdminTournament,
  AdminEquipments,
  AdminEquipment,
} from "./pages/admin";
import {
  Login,
  Home,
  NotFound,
  Players,
  Player,
  Equipments,
  Contacts,
} from "./pages";

export type TRoute = {
  path: string;
  name: string;
  element: ReactNode;
  isHidden?: boolean;
};

export const ROUTES: TRoute[] = [
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
    element: <Players />,
  },
  {
    path: "/players/:playerId",
    name: "player",
    element: <Player />,
    isHidden: true,
  },
  {
    path: "/equipments",
    name: "equipments",
    element: <Equipments />,
  },
  {
    path: "/contacts",
    name: "contacts",
    element: <Contacts />,
  },
  {
    path: "*",
    name: "not-found",
    element: <NotFound />,
    isHidden: true,
  },
];

export const ADMIN_ROUTES: TRoute[] = [
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
  {
    path: "/admin/players/new",
    name: "player",
    element: <AdminPlayer />,
    isHidden: true,
  },
  {
    path: "/admin/players/edit/:playerId",
    name: "player",
    element: <AdminPlayer />,
    isHidden: true,
  },
  {
    path: "/admin/decks",
    name: "decks",
    element: <AdminDecks />,
  },
  {
    path: "/admin/decks/new",
    name: "deck",
    element: <AdminDeck />,
    isHidden: true,
  },
  {
    path: "/admin/decks/edit/:deckId",
    name: "deck",
    element: <AdminDeck />,
    isHidden: true,
  },
  {
    path: "/admin/tournaments",
    name: "tournaments",
    element: <AdminTournaments />,
  },
  {
    path: "/admin/tournaments/new",
    name: "tournaments",
    element: <AdminTournament />,
    isHidden: true,
  },
  {
    path: "/admin/tournaments/edit/:tournamentId",
    name: "tournaments",
    element: <AdminTournament />,
    isHidden: true,
  },
  {
    path: "/admin/equipments",
    name: "equipments",
    element: <AdminEquipments />,
  },
  {
    path: "/admin/equipments/new",
    name: "equipments",
    element: <AdminEquipment />,
    isHidden: true,
  },
  {
    path: "/admin/equipments/edit/:equipmentId",
    name: "equipments",
    element: <AdminEquipment />,
    isHidden: true,
  },
];
