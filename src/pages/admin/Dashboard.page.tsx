import React, { FC, JSX, useContext } from "react";

// Assets
import { useTranslation } from "react-i18next";
import { MONTHS } from "../../assets/constants";

// Components
import { Card, DoughnutChart, LineChart } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";

// Types
import { TLineChartData } from "../../components/LineChart.component";

// Utils
import { setPageTitle } from "../../utils";
import { TDoughnutChartData } from "../../components/DoughnutChart.component";

const Dashboard: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  const pageTitle: string = t("dashboard");

  setPageTitle(pageTitle);

  // TODO: get data
  const lineChartData: TLineChartData[] = [
    {
      label: t(new Date().getFullYear().toString()),
      data: [40, 20, 20, 10, 21, 23, 45, 45, 66, 23, 45, 67],
      borderColor: "#f37c90",
    },
    {
      label: "2024",
      data: [20, 30, 50, 10, 70],
      borderColor: "#cccccc",
    },
  ];

  const lineChartLabels: string[] = MONTHS.map((month: string) => {
    return t(month);
  });

  const totalTops: number = 75;
  const totalPlayers: number = 20;

  const title: JSX.Element = (
    <span className="text-primary font-bold text-xl">{pageTitle}</span>
  );

  const totalTopsComponent: JSX.Element = (
    <Card filled isDarkMode={isDarkMode}>
      <div
        className={`flex flex-col transition-all duration-300 ${
          isDarkMode ? "text-black" : "text-white"
        }`}
      >
        <span>{t("totalTops")}</span>
        <span className="text-[3em] font-bold">{totalTops}</span>
      </div>
    </Card>
  );

  const tops: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <LineChart
        labels={lineChartLabels}
        data={lineChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  const totalPlayersComponent: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <div
        className={`flex flex-col transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <span>{t("totalPlayers")}</span>
        <span className="text-[3em] font-bold">{totalPlayers}</span>
      </div>
    </Card>
  );

  const doughnutChartLabels: string[] = [
    "Tearlaments",
    "Kashtira",
    "Centur-Ion",
  ].map((deck: string) => {
    return t(deck);
  });

  // TODO: get data
  const doughnutChartData: TDoughnutChartData = {
    label: t("top"),
    data: [300, 50, 100],
    backgroundColor: ["#f37c90", "#008000", "#ffa500"],
  };
  const bestDecks: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <DoughnutChart
        labels={doughnutChartLabels}
        data={doughnutChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      <div className="flex flex-row w-full gap-5 mobile:flex-col">
        <div className="w-[40%] flex flex-row justify-between flex-wrap gap-5 mobile:w-full">
          <div className="h-72 w-[30vh] mobile:w-full mobile:h-40">{totalTopsComponent}</div>
          <div className="h-72 w-[30vh] mobile:w-full">{bestDecks}</div>
          <div className="w-full">{totalPlayersComponent}</div>
        </div>
        <div className="w-[60%] mobile:w-full">{tops}</div>
      </div>
    </div>
  );
};

export default Dashboard;
