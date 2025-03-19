import React, { FC, JSX, useContext, useEffect, useState } from "react";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

// Api
import { PLAYER_API } from "../../api";

// Assets
import { useTranslation } from "react-i18next";

// Components
import { Button, Card, Input, Modal, Table } from "../../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/Popup.provider";
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";

// Icons
import { AddIcon, SearchIcon } from "../../assets/icons";

// Types
import { THTTPResponse } from "../../types";
import { TPlayer } from "../../types/player.type";
import { TColumn } from "../../components/Table.component";

// Utils
import { setPageTitle } from "../../utils";

interface ITable {
  from: number;
  to: number;
  total: number;
  page: number;
  name: string;
}

const Players: FC = () => {
  const { t } = useTranslation();
  const { state: isLoading, setState: setIsLoading }: TLoaderContext =
    useContext(LoaderContext) as TLoaderContext;
  const { onOpen: openOpup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [tableData, setTableData] = useState<TPlayer[] | null>(null);
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const [searchParams, setSearchParams] = useSearchParams({});
  const tableDefaultState: ITable = {
    from: parseInt(searchParams.get("from") as string) || 0,
    to: parseInt(searchParams.get("to") as string) || 4,
    total: parseInt(searchParams.get("total") as string) || 0,
    page: parseInt(searchParams.get("page") as string) || 1,
    name: searchParams.get("name") || "",
  };
  const [table, setTable] = useState<ITable>(tableDefaultState);
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<TPlayer | null>(null);

  const pageTitle: string = t("players");
  const selectedPlayerId: string = selectedPlayer?.id as string;

  setPageTitle(pageTitle);

  const talbeColumns: TColumn[] = [
    { key: "name", value: t("name") },
    { key: "surname", value: t("surname") },
    { key: "birthDate", value: t("birthDate") },
    { key: "email", value: t("email") },
  ];

  async function getData(): Promise<any> {
    setIsLoading(true);

    await Promise.resolve(
      PLAYER_API.getAllWithFilters(table.from, table.to, table.name)
    ).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) {
        setTableData(response.data);
        setTable((prevState) => {
          return { ...prevState, total: response?.totalRecords as number };
        });
      } else openOpup(t("unableLoadPlayers"), "error");
    });

    setIsLoading(false);
  }

  async function onGoPreviousPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page - 1,
        from: table.from - 5,
        to: table.to - 5,
      };
    });
  }

  async function onGoNextPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page + 1,
        from: table.from + 5,
        to: table.to + 5,
      };
    });
  }

  async function onDelete(rowData: any): Promise<void> {
    setDeleteModal(true);
    setSelectedPlayer(rowData);
  }

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, [table.from, table.to]);

  useEffect(() => {
    setSearchParams({
      name: table.name,
      from: table.from,
      to: table.to,
      page: table.page,
    } as any);

    // eslint-disable-next-line
  }, [table.name, table.from, table.to, table.page]);

  const title: JSX.Element = (
    <span className="text-primary text-2xl">{pageTitle}</span>
  );

  async function onDeletePlayer(): Promise<any> {
    setDeleteModal(false);
    setIsLoading(true);

    await Promise.resolve(PLAYER_API.delete(selectedPlayerId)).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) {
          openOpup(t("playerDeleted"), "success");
          getData();
        } else openOpup(t("unableDeletePlayer"), "error");
      }
    );

    setIsLoading(false);
  }

  const deleteModalComponent: JSX.Element = (
    <Modal
      title={t("deletePlayer")}
      isOpen={deleteModal}
      onClose={() => setDeleteModal(false)}
      onSubmit={onDeletePlayer}
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
        {t("confirmToDelete", { name: selectedPlayer?.name })}
      </span>
    </Modal>
  );

  return (
    <>
      <div className="w-full h-full flex flex-col gap-5">
        {title}
        <div className="flex flex-col gap-5">
          <div className="flex justify-end">
            <div className="flex flex-row items-center gap-5 mobile:w-full">
              <Input
                value={table.name}
                onChange={(value: string) =>
                  setTable((prevState) => {
                    return {
                      ...prevState,
                      name: value,
                      from: 0,
                      to: 4,
                      page: 1,
                    };
                  })
                }
                icon={<SearchIcon className="text-primary text-2xl" />}
                placeholder={t("name")}
                isDarkMode={isDarkMode}
                onSearch={getData}
                width="100%"
              />
              <div>
                <Button
                  onClick={() => navigate(`${pathname}/new`)}
                  styleType="round"
                >
                  <AddIcon className="text-white text-2xl" />
                </Button>
              </div>
            </div>
          </div>
          <Card isDarkMode={isDarkMode}>
            <Table
              data={tableData}
              columns={talbeColumns}
              isDarkMode={isDarkMode}
              total={table.total}
              onGoPreviousPage={onGoPreviousPage}
              onGoNextPage={onGoNextPage}
              info={table}
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </Card>
        </div>
      </div>
      {deleteModalComponent}
    </>
  );
};

export default Players;
