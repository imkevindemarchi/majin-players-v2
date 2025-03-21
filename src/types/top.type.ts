import { DateValue } from "@heroui/react";

// Types
import { TDeck } from "./deck.type";
import { TTournament } from "./tournament.type";

export type TTop = {
  id: string | null;
  date: Date | DateValue | null;
  rating: string | null;
  deck: TDeck | null;
  tournament: TTournament | null;
  location: string | null;
  playerId: string | null;
};
