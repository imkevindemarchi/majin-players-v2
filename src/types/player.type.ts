// Types
import { TDeck } from "./deck.type";

export type TPlayer = {
  id: string;
  name: string;
  surname: string;
  image: string;
  birthDate: Date;
  email?: string;
  favouriteCard?: string;
  favouriteDeck?: TDeck;
  instagramLink?: string;
  description?: string;
};
