import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Card from "./Card.component";
import IconButton from "./IconButton.component";
import Modal from "./Modal.component";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

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
  isAdmin?: boolean;
}

const Tops: FC<IProps> = ({ data, isDarkMode, getData, isAdmin }) => {
  const { t } = useTranslation();
  const [years, setYears] = useState<number[] | null>(null);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedTop, setSelectedTop] = useState<TTop | null>(null);

  const selectedTopId: string = selectedTop?.id as string;

  function getTopsDistinctYears(): number[] {
    return Array.from(
      new Set(data?.map((top: any) => top?.date?.year as number))
    );
  }

  async function onDelete() {
    setDeleteModal(false);
    setIsLoading(true);

    await Promise.resolve(TOP_API.remove(selectedTopId)).then(
      async (response: THTTPResponse) => {
        if (response && response.hasSuccess) {
          openPopup(t("topRemoved"), "success");
          await getData();
        } else openPopup(t("unableRemoveTop"), "error");
      }
    );

    setIsLoading(false);
  }

  function onDeleteTop(top: TTop): void {
    setDeleteModal(true);
    setSelectedTop(top);
  }

  const list: ReactNode = (
    <div className="flex flex-col gap-5">
      {years?.map((year: number, index: number) => {
        return (
          <div key={index} className="flex flex-col gap-5">
            <span className="text-primary text-2xl font-bold">{year}</span>

            <div className="pl-10 flex flex-col gap-5 mobile:pl-0">
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
                      className="bg-primary-transparent py-2 px-5 rounded-xl flex justify-between mobile:gap-5 items-center"
                      key={index2}
                    >
                      <div className="flex gap-5 items-center flex-wrap mobile:gap-1">
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
                      {isAdmin && (
                        <IconButton onClick={() => onDeleteTop(top)} small>
                          <DeleteIcon className="text-primary text-xl" />
                        </IconButton>
                      )}
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

  const noData: ReactNode = (
    <span
      className={`transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {t("noRegisteredTops")}
    </span>
  );

  const deleteModalComponent: ReactNode = (
    <Modal
      title={t("deleteTop")}
      isOpen={deleteModal}
      onClose={() => setDeleteModal(false)}
      onSubmit={onDelete}
      onCancel={() => setDeleteModal(false)}
      submitBtnText={t("yes")}
      cancelBtnText={t("no")}
      isDarkMode={isDarkMode}
    >
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("confirmToDeleteTop")}
      </span>
    </Modal>
  );

  useEffect(() => {
    const distinctYears: number[] = getTopsDistinctYears();
    const orderedDistinctYears: number[] = distinctYears.sort((a, b) => b - a);
    setYears(orderedDistinctYears);

    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <Card isDarkMode={isDarkMode}>
        {data && data.length > 0 ? list : noData}
      </Card>
      {deleteModalComponent}
    </>
  );
};

export default Tops;
