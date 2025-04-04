import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Api
import { EQUIPMENT_API } from "../api";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { THTTPResponse } from "../types";
import { TEquipment } from "../types/equipment.type";

// Utils
import { setPageTitle } from "../utils";

const Equipments: FC = () => {
  const { t } = useTranslation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const [equipments, setEquipments] = useState<TEquipment[]>([]);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  setPageTitle(t("equipments"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(EQUIPMENT_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setEquipments(response.data);
        else openPopup(t("unableLoadEquipments"), "error");
      }
    );

    setIsLoading(false);
  }

  const list: ReactNode = (
    <div className="flex items-center flex-wrap justify-center gap-10">
      {equipments.map((equipment: TEquipment, index: number) => {
        return (
          <div
            className={`transition-all duration-300 rounded-3xl flex items-center justify-center flex-col gap-5 w-[40vh] h-[40vh] mobile:w-full mobile:h-[50vh] ${
              isDarkMode ? "bg-darkgray" : "bg-lightgray"
            }`}
          >
            <img
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${equipment?.id}`}
              alt={t("imgNotFound")}
              className="h-60 w-60 object-contain"
            />
            <span
              className={`transition-all duration-300 text-center ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {equipment.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return <div className="flex flex-col">{list}</div>;
};

export default Equipments;
