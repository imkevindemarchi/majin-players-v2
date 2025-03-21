import { DateValue } from "@heroui/react";

// Types
import { TDeck } from "./deck.type";

export type TPlayer = {
  id: string | null;
  name: string | null;
  surname: string | null;
  birthDate?: Date | DateValue | null;
  email?: string | null;
  favouriteCard?: string | null;
  favouriteDeck?: TDeck | null;
  instagramLink?: string | null;
  description?: string | null;
};
