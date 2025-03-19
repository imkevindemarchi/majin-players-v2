// Types
import { TDeck } from "./deck.type";
import { TTournament } from "./tournament.type";

export type TTop = {
  id: string;
  date: Date;
  rating: string;
  deck: TDeck;
  tournament: TTournament;
  location: string;
  playerId: string;
};
