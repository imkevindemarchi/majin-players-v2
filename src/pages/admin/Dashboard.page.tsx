import React, { FC, JSX, useContext, useEffect, useState } from "react";

// Api
import { TOP_API, PLAYER_API } from "../../api";

// Assets
import { useTranslation } from "react-i18next";
import { MONTHS } from "../../assets/constants";

// Components
import { Card, DoughnutChart, LineChart } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/Popup.provider";

// Types
import { TLineChartData } from "../../components/LineChart.component";
import { TDoughnutChartData } from "../../components/DoughnutChart.component";
import { THTTPResponse } from "../../types";
import { TTop } from "../../types/top.type";

// Utils
import { setPageTitle } from "../../utils";

type TCurrentTopDeck = {
  valore: any;
  conteggio: any;
  elementi: TTop[];
};

const topsForMonthDefaultState = [
  {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
  },
];

const Dashboard: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const [totalTops, setTotalTops] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [doughnutChartLabels, setDoughnutChartLabels] = useState<
    string[] | null
  >(null);
  const [doughnutChartData, setDoughnutChartData] = useState<number[] | null>(
    null
  );
  const [previousYearLineChartData, setPreviousYearLineChartData] = useState<
    number[] | null
  >(null);
  const [currentYearLineChartData, setCurrentYearLineChartData] = useState<
    number[] | null
  >(null);

  const pageTitle: string = t("dashboard");
  const elabDoughnutChartLabels: string[] = doughnutChartLabels?.map(
    (deck: string) => {
      return t(deck);
    }
  ) as string[];
  const currentYear: number = new Date().getFullYear();
  const previousYear: number = new Date().getFullYear() - 1;
  const elabDoughnutChartData: TDoughnutChartData = {
    label: t("top"),
    data: doughnutChartData as number[],
    backgroundColor: [
      process.env.REACT_APP_PRIMARY_COLOR as string,
      process.env.REACT_APP_SECONDARY_COLOR as string,
      process.env.REACT_APP_TERTIARY_COLOR as string,
    ],
  };
  const elabLineChartData: TLineChartData[] = [
    {
      label: previousYear.toString(),
      data: previousYearLineChartData as number[],
      borderColor: process.env.REACT_APP_PRIMARY_COLOR as string,
    },
    {
      label: currentYear.toString(),
      data: currentYearLineChartData as number[],
      borderColor: process.env.REACT_APP_SECONDARY_COLOR as string,
    },
  ];
  const lineChartLabels: string[] = MONTHS.map((month: string) => {
    return t(month);
  });

  setPageTitle(pageTitle);

  function getCurrentTop3Decks(data: TTop[]): TCurrentTopDeck[] {
    const currentTops: TTop[] = [];
    data.forEach((top: TTop) => {
      top.date.getFullYear() === new Date().getFullYear() &&
        currentTops.push(top);
    });

    const counter: any = {};
    currentTops.forEach((top: TTop) => {
      const element: string = top.deck.label as string;
      counter[element] = (counter[element] || 0) + 1;
    });

    const currentTop3Decks: TCurrentTopDeck[] = [
      ...new Set(currentTops.map((top: TTop) => top?.deck?.label)),
    ]
      .map((value: any) => ({
        valore: value,
        conteggio: counter[value],
        elementi: currentTops.filter((top: TTop) => top?.deck === value),
      }))
      .sort((a, b) => b.conteggio - a.conteggio)
      .slice(0, 3);

    return currentTop3Decks;
  }

  function splitTopsForMonth(tops: TTop[]): any {
    const data: any = {};

    tops.forEach((top: TTop) => {
      const month: number = top.date.getMonth();

      if (!data[month.toString()]) {
        data[month] = [];
      }

      data[month].push(top);
    });

    return data;
  }

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([TOP_API.getAll(), PLAYER_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess) {
          const currentTop3Decks: TCurrentTopDeck[] = getCurrentTop3Decks(
            response[0].data
          );

          const currentTop3DecksName: string[] = [];
          const currentTop3DecksCounters: number[] = [];

          currentTop3Decks.forEach((currentTopDeck: TCurrentTopDeck) => {
            currentTop3DecksName.push(currentTopDeck.valore);
            currentTop3DecksCounters.push(currentTopDeck.conteggio);
          });

          setDoughnutChartLabels(currentTop3DecksName);
          setDoughnutChartData(currentTop3DecksCounters);

          const previousYearTops: TTop[] = response[0].data.filter(
            (top: TTop) => top.date.getFullYear() === previousYear
          );
          const currentYearTops: TTop[] = response[0].data.filter(
            (top: TTop) => top.date.getFullYear() === currentYear
          );

          const splittedPreviousYearTopsForMonth: any =
            splitTopsForMonth(previousYearTops);
          const splittedCurrentYearTopsForMonth: any =
            splitTopsForMonth(currentYearTops);

          const previousYearTopsForMonth: any[] = [...topsForMonthDefaultState];
          const currentYearTopsForMonth: any[] = [...topsForMonthDefaultState];

          Object.entries(splittedPreviousYearTopsForMonth).forEach(
            ([month, elements]: any) => {
              previousYearTopsForMonth[month.toString()] = elements.length;
            }
          );
          Object.entries(splittedCurrentYearTopsForMonth).forEach(
            ([month, elements]: any) => {
              currentYearTopsForMonth[month.toString()] = elements.length;
            }
          );

          setPreviousYearLineChartData(previousYearTopsForMonth);
          setCurrentYearLineChartData(currentYearTopsForMonth);

          setTotalTops(response[0]?.totalRecords as number);
        } else openPopup(t("unableLoadTops"), "error");

        if (response[1] && response[1].hasSuccess) {
          setTotalPlayers(response[1]?.totalRecords as number);

          setTotalPlayers(response[1]?.totalRecords as number);
        } else openPopup(t("unableLoadPlayers"), "error");
      }
    );

    setIsLoading(false);
  }

  const title: JSX.Element = (
    <span className="text-primary text-2xl">{pageTitle}</span>
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
        data={elabLineChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  const bestDecks: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <DoughnutChart
        labels={elabDoughnutChartLabels}
        data={elabDoughnutChartData}
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

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      <div className="flex flex-row w-full gap-5 mobile:flex-col">
        <div className="w-[40%] flex flex-row justify-between flex-wrap gap-5 mobile:w-full">
          <div className="h-72 w-[30vh] mobile:w-full mobile:h-40">
            {totalTopsComponent}
          </div>
          <div className="h-72 w-[30vh] mobile:w-full">{bestDecks}</div>
          <div className="w-full">{totalPlayersComponent}</div>
        </div>
        <div className="w-[60%] mobile:w-full">{tops}</div>
      </div>
    </div>
  );
};

export default Dashboard;
