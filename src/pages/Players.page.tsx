import React, { FC, JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Api
import { PLAYER_API, TOP_API } from "../api";

// Components
import { Input, PlayerCard } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { SearchIcon } from "../assets/icons";

// Types
import { THTTPResponse } from "../types";
import { TTop } from "../types/top.type";
import { TPlayer } from "../types/player.type";

// Utils
import { setPageTitle } from "../utils";

const Players: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [tops, setTops] = useState<TTop[]>([]);
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const [filter, setFilter] = useState<string | null>(null);

  const filteredPlayers: TPlayer[] = players.filter((player: TPlayer) => {
    return (
      !filter ||
      filter.trim() === "" ||
      player.name
        ?.toLowerCase()
        ?.trim()
        ?.includes(filter?.toLowerCase()?.trim() as string)
    );
  });

  setPageTitle(t("players"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([PLAYER_API.getAll(), TOP_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess) setPlayers(response[0].data);
        else openPopup(t("unableLoadPlayers"), "error");

        if (response[1] && response[1].hasSuccess) {
          setTops(response[1].data);
        } else openPopup(t("unableLoadTops"), "error");
      }
    );

    setIsLoading(false);
  }

  const input: JSX.Element = (
    <Input
      autofocus
      value={filter}
      onChange={(value: string) => setFilter(value)}
      icon={<SearchIcon className="text-primary text-2xl" />}
      placeholder={t("name")}
      isDarkMode={isDarkMode}
      width="100%"
    />
  );

  const list: JSX.Element = (
    <div className="flex items-center gap-10 flex-wrap justify-center mobile:gap-5">
      {filteredPlayers.map((player: TPlayer, index: number) => {
        return (
          <PlayerCard
            key={index}
            data={player}
            isDarkMode={isDarkMode}
            tops={tops}
          />
        );
      })}
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {input}
      {list}
    </div>
  );
};

export default Players;
