import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";

// Assets
import logoImg from "../assets/images/logo.png";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/Theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";

const Loader: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { isLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;

  return isLoading ? (
    <div
      className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${
        isDarkMode ? "bg-black-transparent" : "bg-white-transparent"
      }`}
    >
      <img
        src={logoImg}
        alt={t("imgNotFound")}
        className="w-60 mobile:w-40"
        style={{ animation: "animateLogo  linear 1s infinite alternate" }}
      />
    </div>
  ) : (
    <></>
  );
};

export default Loader;
