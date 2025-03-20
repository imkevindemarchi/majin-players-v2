// Types
import { DateValue } from "@heroui/react";
import { TDeck } from "./deck.type";

export type TPlayer = {
  id: string | null;
  name: string | null;
  surname: string | null;
  image: string | null;
  birthDate: DateValue | null;
  email?: string | null;
  favouriteCard?: string | null;
  favouriteDeck?: TDeck | null;
  instagramLink?: string | null;
  description?: string | null;
};
