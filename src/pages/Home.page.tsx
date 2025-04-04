import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";
import { DateValue } from "@heroui/react";

// Api
import { TOP_API } from "../api";

// Assets
import { MONTHS, SOCIAL_NAMES, SOCIALS, TSocial } from "../assets/constants";

// Components
import { Button, Card, DoughnutChart, LineChart } from "../components";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Icons
import { InstagramIcon, YoutubeIcon } from "../assets/icons";

// Types
import { THTTPResponse } from "../types";
import { TTop } from "../types/top.type";
import { TDoughnutChartData } from "../components/DoughnutChart.component";
import { TLineChartData } from "../components/LineChart.component";

// Utils
import { setPageTitle } from "../utils";

type TCurrentTopDeck = {
  valore: any;
  conteggio: any;
  elementi: TTop[];
};

const Home: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const navigate: NavigateFunction = useNavigate();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const [doughnutChartLabels, setDoughnutChartLabels] = useState<
    string[] | null
  >(null);
  const [doughnutChartData, setDoughnutChartData] = useState<number[] | null>(
    null
  );
  const [previousYearLineChartData, setPreviousYearLineChartData] =
    useState<any>(null);
  const [currentYearLineChartData, setCurrentYearLineChartData] = useState<
    number[] | null
  >(null);
  const [totalTops, setTotalTops] = useState<number | null>(null);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  const currentYear: number = new Date().getFullYear();
  const previousYear: number = new Date().getFullYear() - 1;
  const elabDoughnutChartLabels: string[] = doughnutChartLabels?.map(
    (deck: string) => {
      return t(deck);
    }
  ) as string[];
  const elabDoughnutChartData: TDoughnutChartData = {
    label: t("top"),
    data: doughnutChartData as number[],
    backgroundColor: [
      process.env.REACT_APP_PRIMARY_COLOR as string,
      process.env.REACT_APP_SECONDARY_COLOR as string,
      process.env.REACT_APP_TERTIARY_COLOR as string,
    ],
  };
  const lineChartLabels: string[] = MONTHS.map((month: string) => {
    return t(month);
  });
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

  setPageTitle(t("home"));

  function getCurrentTop3Decks(data: TTop[]): TCurrentTopDeck[] {
    const currentTops: TTop[] = [];
    data.forEach((top: TTop) => {
      const date: DateValue = top.date as DateValue;
      date?.year === new Date()?.getFullYear() && currentTops.push(top);
    });

    const counter: any = {};
    currentTops.forEach((top: TTop) => {
      const element: string = top.deck?.label as string;
      counter[element] = (counter[element] || 0) + 1;
    });

    const currentTop3Decks: TCurrentTopDeck[] = [
      ...new Set(currentTops.map((top: TTop) => top.deck?.label)),
    ]
      .map((value: any) => ({
        valore: value,
        conteggio: counter[value],
        elementi: currentTops.filter((top: TTop) => top.deck === value),
      }))
      .sort((a, b) => b.conteggio - a.conteggio)
      .slice(0, 3);

    return currentTop3Decks;
  }

  function splitTopsForMonth(tops: TTop[]): any {
    const data: any = {};

    tops.forEach((top: TTop) => {
      const date: DateValue = top?.date as DateValue;
      const month: number = date?.month;

      if (!data[month.toString()]) {
        data[month] = [];
      }

      data[month].push(top);
    });

    return data;
  }

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(TOP_API.getAll()).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) {
        const currentTop3Decks: TCurrentTopDeck[] = getCurrentTop3Decks(
          response.data
        );

        const currentTop3DecksName: string[] = [];
        const currentTop3DecksCounters: number[] = [];

        currentTop3Decks.forEach((currentTopDeck: TCurrentTopDeck) => {
          currentTop3DecksName.push(currentTopDeck.valore);
          currentTop3DecksCounters.push(currentTopDeck.conteggio);
        });

        setDoughnutChartLabels(currentTop3DecksName);
        setDoughnutChartData(currentTop3DecksCounters);

        const previousYearTops: TTop[] = response.data.filter((top: TTop) => {
          const topDate: DateValue = top?.date as DateValue;
          return topDate?.year === previousYear;
        });
        const currentYearTops: TTop[] = response.data.filter((top: TTop) => {
          const topDate: DateValue = top?.date as DateValue;
          return topDate?.year === currentYear;
        });

        const splittedPreviousYearTopsForMonth: any =
          splitTopsForMonth(previousYearTops);
        const splittedCurrentYearTopsForMonth: any =
          splitTopsForMonth(currentYearTops);

        const previousYearLineChartData: any = {};
        MONTHS.forEach((month: string, index: number) => {
          previousYearLineChartData[t(month)] =
            splittedPreviousYearTopsForMonth[index + 1]?.length;
        });
        const currentYearLineChartData: any = {};
        MONTHS.forEach((month: string, index: number) => {
          currentYearLineChartData[t(month)] =
            splittedCurrentYearTopsForMonth[index + 1]?.length;
        });
        setPreviousYearLineChartData(previousYearLineChartData);
        setCurrentYearLineChartData(currentYearLineChartData);

        setTotalTops(response?.totalRecords as number);
      } else openPopup(t("unableLoadTops"), "error");
    });

    setIsLoading(false);
  }

  const socialsShape: ReactNode = (
    <div
      className="w-[15%] h-[70vh] absolute left-0 flex flex-col gap-5 items-center justify-center mobile:hidden"
      style={{
        borderRadius: "65% 35% 100% 0% / 0% 36% 64% 100%",
        background: process.env.REACT_APP_PRIMARY_COLOR,
      }}
    >
      <div className="absolute left-20 flex flex-col gap-5">
        {SOCIALS.map((social: TSocial, index: number) => {
          return (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className={`text-[3em] transition-all duration-300 opacity-50 hover:opacity-100 ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              {social.name === SOCIAL_NAMES.instagram ? (
                <InstagramIcon />
              ) : (
                social.name === SOCIAL_NAMES.youtube && <YoutubeIcon />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );

  const descriptions: ReactNode = (
    <div className="px-[10%] flex flex-col mobile:px-0">
      <span
        className={`text-[3em] font-bold transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {process.env.REACT_APP_WEBSITE_NAME}
      </span>
      <span
        className={`transition-all duration-300 opacity-40 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("eSportTeam")}
      </span>
      <div className="py-20 mobile:py-10">
        <span
          className={`transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("homeDescription")}
        </span>
      </div>
      <div className="w-full flex justify-center items-center">
        <Button onClick={() => navigate("/contacts")}>
          <span
            className={`transition-all duration-300 ${
              isDarkMode ? "text-black" : "text-white"
            }`}
          >
            {t("contactUs")}
          </span>
        </Button>
      </div>
    </div>
  );

  const rightShape: ReactNode = (
    <div
      className="w-[15%] h-[70vh] absolute right-0 top-[30vh] flex flex-col gap-5 items-center justify-center mobile:hidden"
      style={{
        borderRadius: "100% 0% 0% 100% / 33% 100% 0% 67% ",
        background: process.env.REACT_APP_PRIMARY_COLOR,
      }}
    />
  );

  const totalTopsComponent: ReactNode = (
    <Card filled isDarkMode={isDarkMode} visibleBackground>
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

  const bestDecks: ReactNode = (
    <Card isDarkMode={isDarkMode} visibleBackground>
      <DoughnutChart
        labels={elabDoughnutChartLabels}
        data={elabDoughnutChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  const tops: ReactNode = (
    <Card isDarkMode={isDarkMode} visibleBackground>
      <LineChart
        labels={lineChartLabels}
        data={elabLineChartData}
        isDarkMode={isDarkMode}
      />
    </Card>
  );

  const statistics: ReactNode = (
    <div className="mt-[30%] w-full flex flex-col justify-center items-center gap-20 mobile:pt-0 mobile:gap-10">
      <div className="flex items-center gap-20 mobile:flex-col mobile:gap-10 mobile:justify-center mobile:w-full">
        <div className="h-72 w-[30vh] mobile:w-full mobile:h-40">
          {totalTopsComponent}
        </div>
        <div className="h-72 w-[30vh] mobile:w-full">{bestDecks}</div>
      </div>
      <div className="w-[60%] mobile:w-full">{tops}</div>
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {socialsShape}
      {descriptions}
      {rightShape}
      {statistics}
    </div>
  );
};

export default Home;
