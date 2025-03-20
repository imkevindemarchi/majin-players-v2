import React, { JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { DateValue } from "@heroui/react";

// Api
import { DECK_API } from "../../api";

// Components
import {
  Autocomplete,
  Breadcrumb,
  Card,
  DatePicker,
  Input,
  Textarea,
} from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/Popup.provider";

// Types
import { TPlayer } from "../../types/player.type";
import { TDeck } from "../../types/deck.type";
import { THTTPResponse } from "../../types";

// Utils
import { setPageTitle } from "../../utils";

const defaultState: TPlayer = {
  id: null,
  name: null,
  surname: null,
  image: null,
  birthDate: null,
  email: null,
  favouriteCard: null,
  favouriteDeck: null,
  instagramLink: null,
  description: null,
};

const AdminPlayer = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { playerId } = useParams();
  const [formData, setFormData] = useState<TPlayer>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openOpup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [decks, setDecks] = useState<TDeck[]>([]);

  const isEditMode: boolean = playerId ? true : false;

  setPageTitle(isEditMode ? t("editPlayer") : t("newPlayer"));

  async function getData(): Promise<any> {
    setIsLoading(true);

    await Promise.resolve(DECK_API.getAll()).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) setDecks(response.data);
      else openOpup(t("unableLoadPlayers"), "error");
    });

    setIsLoading(false);
  }

  function onInputChange(propLabel: string, value: any): void {
    setFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
  }

  const title: JSX.Element = (
    <span className="text-primary text-2xl">{t("player")}</span>
  );

  const breadcrumb: JSX.Element = <Breadcrumb isDarkMode={isDarkMode} />;

  const form: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <form className="flex flex-row flex-wrap gap-10 mobile:gap-5">
        <div className="w-[31.5%] mobile:w-full">
          <Input
            value={formData.name}
            onChange={(value: string) => onInputChange("name", value)}
            isDarkMode={isDarkMode}
            placeholder={t("name")}
            width="100%"
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <Input
            value={formData.surname}
            onChange={(value: string) => onInputChange("surname", value)}
            isDarkMode={isDarkMode}
            placeholder={t("surname")}
            width="100%"
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <Input
            value={formData.email as string}
            onChange={(value: string) => onInputChange("email", value)}
            isDarkMode={isDarkMode}
            placeholder={t("email")}
            width="100%"
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <Input
            value={formData.favouriteCard as string}
            onChange={(value: string) => onInputChange("favouriteCard", value)}
            isDarkMode={isDarkMode}
            placeholder={t("favouriteCard")}
            width="100%"
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <Autocomplete
            value={formData.favouriteDeck as TDeck}
            onChange={(value: TDeck) => onInputChange("favouriteDeck", value)}
            isDarkMode={isDarkMode}
            placeholder={t("favouriteDeck")}
            data={decks}
            width="100%"
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <DatePicker
            value={formData.birthDate}
            onChange={(value: DateValue) => onInputChange("birthDate", value)}
            isDarkMode={isDarkMode}
            placeholder={t("birthDate")}
            width="100%"
          />
        </div>
        <div className="w-full">
          <Input
            value={formData.instagramLink as string}
            onChange={(value: string) => onInputChange("instagramLink", value)}
            isDarkMode={isDarkMode}
            placeholder={t("instagramLink")}
            width="100%"
          />
        </div>
        <div className="w-full">
          <Textarea
            value={formData.description as string}
            onChange={(value: string) => onInputChange("description", value)}
            isDarkMode={isDarkMode}
            placeholder={t("description")}
            width="100%"
          />
        </div>
      </form>
    </Card>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      {breadcrumb}
      {form}
    </div>
  );
};

export default AdminPlayer;
