import React, { FC, JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";
import { DateValue } from "@heroui/react";

// Api
import { PLAYER_API, TOP_API } from "../api";

// Components
import { Card, Tops } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { InstagramIcon } from "../assets/icons";
import { ArrowLeft } from "../assets/icons/arrow-left.icon";

// Types
import { THTTPResponse } from "../types";
import { TTop } from "../types/top.type";
import { TPlayer } from "../types/player.type";

// Utils
import { formatDateFromDB, setPageTitle } from "../utils";

interface IRowInfo {
  label: string;
  value: any;
}

const Player: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [player, setPlayer] = useState<TPlayer | null>(null);
  const [tops, setTops] = useState<TTop[]>([]);
  const { playerId: id } = useParams();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const navigate: NavigateFunction = useNavigate();

  const playerTops: TTop[] = [];
  tops.forEach((top: TTop) => {
    top.playerId === id && playerTops.push(top);
  });
  const totalTops: number = playerTops.length;
  const fullName: string = `${player?.name} ${player?.surname}`;

  setPageTitle(t("player"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([PLAYER_API.get(id as string), TOP_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess) setPlayer(response[0].data);
        else openPopup(t("unableLoadPlayers"), "error");

        if (response[1] && response[1].hasSuccess) {
          setTops(response[1].data);
        } else openPopup(t("unableLoadTops"), "error");
      }
    );

    setIsLoading(false);
  }

  const goBackButton: JSX.Element = (
    <div className="w-full flex justify-start">
      <button
        onClick={() => navigate("/players")}
        className={`transition-all duration-300 w-auto flex items-center gap-2 underline font-bold cursor-pointer hover:text-primary ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <ArrowLeft className="text-xl" />
        <span>{t("goBack")}</span>
      </button>
    </div>
  );

  const RowInfo = ({ label, value }: IRowInfo) => {
    return (
      <div className="flex items-center gap-2 mobile:items-start">
        <span
          className={`transition-all duration-300 text-lg whitespace-nowrap ${
            isDarkMode ? "text-gray" : "text-darkgray2"
          }`}
        >
          {t(label)}:
        </span>
        <span className="text-primary text-lg">{value}</span>
      </div>
    );
  };

  const card: JSX.Element = (
    <Card visibleBackground isDarkMode={isDarkMode}>
      <div className="flex gap-5 h-[50vh] relative mobile:flex-col mobile:h-[130vh] mobile:justify-center mobile:items-center">
        <img
          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${player?.id}`}
          alt={t("imgNotFound")}
          className="h-full object-contain rounded-3xl mobile:w-60 mobile:h-auto"
        />
        <div className="w-full h-full mobile:flex">
          <Card isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-5">
              <span
                className={`transition-all duration-300 text-3xl mobile:text-center ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {fullName}
              </span>
              <div className="flex flex-col">
                {player?.birthDate && (
                  <RowInfo
                    label="birthDate"
                    value={formatDateFromDB(player?.birthDate as DateValue)}
                  />
                )}
                {player?.favouriteCard && (
                  <RowInfo label="favouriteCard" value={player.favouriteCard} />
                )}
                {player?.favouriteDeck && (
                  <RowInfo
                    label="favouriteDeck"
                    value={player.favouriteDeck?.label}
                  />
                )}
                <RowInfo label="totalTops" value={totalTops} />
              </div>
              {player?.description && (
                <div className="h-40 overflow-y-scroll">
                  <span
                    className={`transition-all duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {player.description}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
        {player?.instagramLink && (
          <a
            href={player.instagramLink}
            target="_blank"
            rel="noreferrer"
            className="transition-all duration-300 absolute bottom-10 right-10 p-2 bg-primary-transparent rounded-xl hover:opacity-50 mobile:hover:opacity-100"
          >
            <InstagramIcon className="text-primary text-[3em]" />
          </a>
        )}
      </div>
    </Card>
  );

  const topsTitle: JSX.Element = (
    <span className="text-primary text-2xl">{t("playerTops")}</span>
  );

  const topsCard: JSX.Element = (
    <Card visibleBackground isDarkMode={isDarkMode}>
      <Tops data={playerTops} isDarkMode={isDarkMode} getData={getData} />
    </Card>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {goBackButton}
      {card}
      {topsTitle}
      {topsCard}
    </div>
  );
};

export default Player;
