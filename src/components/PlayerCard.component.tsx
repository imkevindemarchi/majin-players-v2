import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useLocation, useNavigate } from "react-router";

// Components
import Button from "./Button.component";

// Types
import { TPlayer } from "../types/player.type";
import { TTop } from "../types/top.type";

interface IProps {
  data: TPlayer;
  isDarkMode: boolean;
  tops: TTop[];
}

const PlayerCard: FC<IProps> = ({ data, isDarkMode, tops, ...props }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();

  const fullName: string = `${data.name} ${data.surname}`;
  const playerTops: TTop[] = [];
  tops.forEach((top: TTop) => {
    top.playerId === data.id && playerTops.push(top);
  });
  const totalTops: number = playerTops.length;

  return (
    <div
      className={`transition-all duration-300 rounded-3xl flex justify-between items-center flex-col gap-2 w-60 py-5 px-5 h-[30vh] mobile:h-[40vh] mobile:w-[22vh] mobile:px-3 mobile:py-3 ${
        isDarkMode ? "bg-darkgray" : "bg-lightgray"
      }`}
      {...props}
    >
      <div className="rounded-full overflow-hidden w-24 h-24 border-primary border-4 mobile:w-24 mobile:h-24">
        <img
          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data?.id}`}
          alt={t("imgNotFound")}
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <span
          className={`transition-all duration-300 text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {fullName}
        </span>
        <span
          className={`transition-all duration-300 text-xs mobile:hidden ${
            isDarkMode ? "text-gray" : "text-darkgray"
          }`}
        >
          {data.favouriteDeck?.label}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span
          className={`transition-all duration-300 text-lg ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {totalTops}
        </span>
        <span
          className={`transition-all duration-300 text-sm ${
            isDarkMode ? "text-lightgray" : "text-darkgray2"
          }`}
        >
          {t("tops")}
        </span>
      </div>
      <Button width="100%" onClick={() => navigate(`${pathname}/${data.id}`)}>
        <span className="text-white text-xs mobile:text-sm">
          {t("viewProfile")}
        </span>
      </Button>
    </div>
  );
};

export default PlayerCard;
