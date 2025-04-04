import React, {
  FormEvent,
  useContext,
  useEffect,
  useState,
  FC,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";

// Api
import { DECK_API } from "../../api";

// Components
import { Breadcrumb, Button, Card, Input } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Icons
import { ResetIcon, SaveIcon } from "../../assets/icons";

// Types
import { TDeck } from "../../types/deck.type";
import { THTTPResponse } from "../../types";
import { TValidation, validateFormField } from "../../utils/validation.util";

// Utils
import { setPageTitle } from "../../utils";

const defaultState: TDeck = {
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

const AdminDeck: FC = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { deckId } = useParams();
  const [formData, setFormData] = useState<TDeck>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const navigate: NavigateFunction = useNavigate();

  const isEditMode: boolean = deckId ? true : false;

  setPageTitle(isEditMode ? t("editDeck") : t("newDeck"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    if (isEditMode)
      await Promise.resolve(DECK_API.get(deckId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess) setFormData(response.data);
          else openPopup(t("unableLoadDeck"), "error");
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

      const data: Partial<TDeck> = {
        label: formData.label,
      };

      if (isEditMode)
        await Promise.resolve(DECK_API.update(data, deckId as string)).then(
          async (response: THTTPResponse) => {
            if (response && response.hasSuccess)
              openPopup(t("deckSuccessfullyUpdated"), "success");
            else openPopup(t("unableUpdateDeck"), "error");
          }
        );
      else
        await Promise.resolve(DECK_API.create(data)).then(
          async (response: THTTPResponse) => {
            if (response && response.hasSuccess) {
              openPopup(t("deckSuccessfullyCreated"), "success");
              navigate(`/admin/decks/edit/${response.data}`);
            } else openPopup(t("unableCreateDeck"), "error");
          }
        );

      setIsLoading(false);
    }
  }

  function onCancel(): void {
    setFormData(defaultState);
    setErrors(defaultErrorsState);
  }

  const title: ReactNode = (
    <span className="text-primary text-2xl">{t("deck")}</span>
  );

  const breadcrumb: ReactNode = <Breadcrumb isDarkMode={isDarkMode} />;

  const buttons: ReactNode = (
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

  const form: ReactNode = (
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

export default AdminDeck;
