import React, { FC, JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Card from "./Card.component";
import IconButton from "./IconButton.component";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/Popup.provider";

// Icons
import { DeleteIcon } from "../assets/icons";

// Types
import { TTop } from "../types/top.type";
import { TOP_API } from "../api";
import { THTTPResponse } from "../types";

interface IProps {
  data: TTop[] | null;
  isDarkMode: boolean;
  getData: () => void;
}

const Tops: FC<IProps> = ({ data, isDarkMode, getData }) => {
  const { t } = useTranslation();
  const [years, setYears] = useState<number[] | null>(null);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  function getTopsDistinctYears(): number[] {
    return Array.from(
      new Set(data?.map((top: any) => top?.date?.year as number))
    );
  }

  async function onDeleteTop(topId: string) {
    setIsLoading(true);

    await Promise.resolve(TOP_API.remove(topId)).then(
      async (response: THTTPResponse) => {
        if (response && response.hasSuccess) {
          openPopup(t("topRemoved"), "success");
          await getData();
        } else openPopup(t("unableRemoveTop"), "error");
      }
    );

    setIsLoading(false);
  }

  const list: JSX.Element = (
    <div className="flex flex-col gap-5">
      {years?.map((year: number, index: number) => {
        return (
          <div key={index} className="flex flex-col gap-5">
            <span className="text-primary text-2xl font-bold">{year}</span>

            <div className="pl-10 flex flex-col gap-5">
              {data?.map((top: any, index2: number) => {
                const isTop: boolean = top?.rating
                  ?.toLowerCase()
                  ?.includes("top")
                  ? true
                  : false;
                const rating: string = isTop
                  ? (top?.rating as string)
                  : `${top?.rating}° posto`;
                const isTopVisible: boolean =
                  year === (top?.date?.year as number);

                return (
                  isTopVisible && (
                    <div
                      className="bg-primary-transparent py-2 px-5 rounded-xl flex justify-between"
                      key={index2}
                    >
                      <div className="flex gap-5 items-center">
                        <span className="text-primary font-bold">{rating}</span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          -
                        </span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {top?.tournament?.label}
                        </span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          -
                        </span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {top?.deck?.label}
                        </span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          -
                        </span>
                        <span
                          className={`transition-all duration-300 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {top?.location}
                        </span>
                      </div>
                      <IconButton onClick={() => onDeleteTop(top?.id)}>
                        <DeleteIcon className="text-primary text-xl" />
                      </IconButton>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const noData: JSX.Element = (
    <span
      className={`transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {t("noRegisteredTops")}
    </span>
  );

  useEffect(() => {
    const distinctYears: number[] = getTopsDistinctYears();
    const orderedDistinctYears: number[] = distinctYears.sort((a, b) => b - a);
    setYears(orderedDistinctYears);

    // eslint-disable-next-line
  }, [data]);

  return (
    <Card isDarkMode={isDarkMode}>
      {data && data.length > 0 ? list : noData}
    </Card>
  );
};

export default Tops;
