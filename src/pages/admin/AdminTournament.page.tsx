import React, { FormEvent, JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";

// Api
import { TOURNAMENT_API } from "../../api";

// Components
import { Breadcrumb, Button, Card, Input } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/Popup.provider";

// Icons
import { ResetIcon, SaveIcon } from "../../assets/icons";

// Types
import { TTournament } from "../../types/tournament.type";
import { THTTPResponse } from "../../types";
import { TValidation, validateFormField } from "../../utils/validation.util";

// Utils
import { setPageTitle } from "../../utils";

const defaultState: TTournament = {
  id: null,
  label: null,
};

type TErrors = {
  label: TValidation;
};

const defaultErrorsState: TErrors = {
  label: {
    isValid: true,
  },
};

const AdminTournament = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { tournamentId } = useParams();
  const [formData, setFormData] = useState<TTournament>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const navigate: NavigateFunction = useNavigate();

  const isEditMode: boolean = tournamentId ? true : false;

  setPageTitle(isEditMode ? t("editTournament") : t("newTournament"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    if (isEditMode)
      await Promise.resolve(TOURNAMENT_API.get(tournamentId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess) setFormData(response.data);
          else openPopup(t("unableLoadTournament"), "error");
        }
      );

    setIsLoading(false);
  }

  function onInputChange(propLabel: string, value: any): void {
    setFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function validateForm(): boolean {
    const isLabelValid: TValidation = validateFormField(
      formData.label as string,
      t
    );

    const isFormValid: boolean = isLabelValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        label: {
          isValid: isLabelValid.isValid,
          message: isLabelValid.message,
        },
      }));

      return false;
    }
  }

  async function onSave(event?: FormEvent): Promise<void> {
    event?.preventDefault();

    const isFormValid: boolean = validateForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      setIsLoading(true);

      const data: Partial<TTournament> = {
        label: formData.label,
      };

      if (isEditMode)
        await Promise.resolve(
          TOURNAMENT_API.update(data, tournamentId as string)
        ).then(async (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            openPopup(t("tournamentSuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateTournament"), "error");
        });
      else
        await Promise.resolve(TOURNAMENT_API.create(data)).then(
          async (response: THTTPResponse) => {
            if (response && response.hasSuccess) {
              openPopup(t("tournamentSuccessfullyCreated"), "success");
              navigate(`/admin/tournaments/edit/${response.data}`);
            } else openPopup(t("unableCreateTournament"), "error");
          }
        );

      setIsLoading(false);
    }
  }

  function onCancel(): void {
    setFormData(defaultState);
    setErrors(defaultErrorsState);
  }

  const title: JSX.Element = (
    <span className="text-primary text-2xl">{t("tournament")}</span>
  );

  const breadcrumb: JSX.Element = <Breadcrumb isDarkMode={isDarkMode} />;

  const buttons: JSX.Element = (
    <div className="flex justify-end">
      <div className="flex gap-5 mobile:w-full mobile:justify-between">
        <Button onClick={onCancel} styleType="secondary">
          <div className="flex items-center gap-2">
            <ResetIcon className="text-primary" />
            <span className="text-primary">{t("cancel")}</span>
          </div>
        </Button>
        <Button onClick={onSave}>
          <div className="flex items-center gap-2">
            <SaveIcon className="text-white" />
            <span className="text-white">{t("save")}</span>
          </div>
        </Button>
      </div>
    </div>
  );

  const form: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center mobile:flex-col">
          <form
            onSubmit={onSave}
            className="flex justify-center items-center w-full"
          >
            <Input
              value={formData.label}
              onChange={(value: string) => onInputChange("label", value)}
              isDarkMode={isDarkMode}
              placeholder={t("name")}
              width="100%"
              errorMessage={errors?.label?.message}
            />
          </form>
        </div>
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
      {breadcrumb}
      {buttons}
      {form}
    </div>
  );
};

export default AdminTournament;
