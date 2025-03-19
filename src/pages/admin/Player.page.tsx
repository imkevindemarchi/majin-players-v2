import React, { JSX, useContext } from "react";
import { useTranslation } from "react-i18next";

// Components
import { Breadcrumb } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";

// Utils
import { setPageTitle } from "../../utils";

const Player = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();

  const pageTitle: string = t("player");

  setPageTitle(pageTitle);

  const title: JSX.Element = (
    <span className="text-primary text-2xl">{pageTitle}</span>
  );

  const breadcrumb: JSX.Element = <Breadcrumb isDarkMode={isDarkMode} />;

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      {breadcrumb}
    </div>
  );
};

export default Player;
