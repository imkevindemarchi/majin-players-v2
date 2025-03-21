import React, { FormEvent, JSX, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";
import { DateValue } from "@heroui/react";

// Api
import { DECK_API, IMAGES_API, PLAYER_API } from "../../api";

// Components
import {
  Autocomplete,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  ImageSelector,
  Input,
  Textarea,
} from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/Theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/Popup.provider";

// Icons
import { ResetIcon, SaveIcon } from "../../assets/icons";

// Types
import { TPlayer } from "../../types/player.type";
import { TDeck } from "../../types/deck.type";
import { THTTPResponse } from "../../types";
import {
  TValidation,
  validateFormEmail,
  validateFormField,
  validateFormImage,
} from "../../utils/validation.util";

// Utils
import { setPageTitle } from "../../utils";

type TImage = { image: File | null };

const defaultState: TPlayer & TImage = {
  id: null,
  name: null,
  surname: null,
  image: null,
  birthDate: null,
  email: null,
  favouriteCard: null,
  favouriteDeck: null,
  instagramLink: null,
  description: null,
};

type TErrors = {
  image: TValidation;
  email: TValidation;
  name: TValidation;
  surname: TValidation;
};

const defaultErrorsState: TErrors = {
  image: {
    isValid: true,
  },
  email: {
    isValid: true,
  },
  name: {
    isValid: true,
  },
  surname: {
    isValid: true,
  },
};

const AdminPlayer = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { playerId } = useParams();
  const [formData, setFormData] = useState<TPlayer & TImage>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [decks, setDecks] = useState<TDeck[]>([]);
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const isEditMode: boolean = playerId ? true : false;

  setPageTitle(isEditMode ? t("editPlayer") : t("newPlayer"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(DECK_API.getAll()).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) setDecks(response.data);
      else openPopup(t("unableLoadPlayers"), "error");
    });

    if (isEditMode)
      await Promise.resolve(PLAYER_API.get(playerId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadPlayer"), "error");
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
    const isImageValid: TValidation = validateFormImage(
      formData.image as File,
      t
    );
    const isEmailValid: TValidation = validateFormEmail(
      formData.email as string,
      t
    );
    const isNameValid: TValidation = validateFormField(
      formData.name as string,
      t
    );
    const isSurnameValid: TValidation = validateFormField(
      formData.surname as string,
      t
    );

    const isFormValid: boolean =
      isImageValid.isValid &&
      isEmailValid.isValid &&
      isNameValid.isValid &&
      isSurnameValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        image: {
          isValid: isImageValid.isValid,
          message: isImageValid.message,
        },
        email: {
          isValid: isEmailValid.isValid,
          message: isEmailValid.message,
        },
        name: {
          isValid: isNameValid.isValid,
          message: isNameValid.message,
        },
        surname: {
          isValid: isSurnameValid.isValid,
          message: isSurnameValid.message,
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

      const data: Partial<TPlayer> = {
        name: formData.name,
        surname: formData.surname,
        birthDate: formData.birthDate,
        description: formData.description,
        email: formData.email,
        favouriteCard: formData.favouriteCard,
        favouriteDeck: formData.favouriteDeck,
        instagramLink: formData.instagramLink,
      };

      if (isEditMode)
        await Promise.resolve(PLAYER_API.update(data, playerId as string)).then(
          async (playerRes: THTTPResponse) => {
            if (playerRes && playerRes.hasSuccess)
              if (isImageUpdated && formData.image)
                await Promise.resolve(IMAGES_API.delete(playerRes.data)).then(
                  (imageRes: THTTPResponse) => {
                    if (imageRes && imageRes.hasSuccess)
                      openPopup(t("playerSuccessfullyUpdated"), "success");
                    else openPopup(t("unableRemoveImage"), "error");
                  }
                );
              else openPopup(t("playerSuccessfullyUpdated"), "success");
            else openPopup(t("unableUpdatePlayer"), "error");
          }
        );
      else
        await Promise.resolve(PLAYER_API.create(data)).then(
          async (playerRes: THTTPResponse) => {
            if (playerRes && playerRes.hasSuccess) {
              await Promise.resolve(
                IMAGES_API.add(playerRes.data, formData.image as File)
              ).then((imageRes: THTTPResponse) => {
                if (imageRes && imageRes.hasSuccess) {
                  openPopup(t("playerSuccessfullyCreated"), "success");
                  navigate(`/admin/players/edit/${playerRes.data}`);
                } else openPopup(t("unableLoadImage"), "error");
              });
            } else openPopup(t("unableCreatePlayer"), "error");
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
    <span className="text-primary text-2xl">{t("player")}</span>
  );

  const breadcrumb: JSX.Element = <Breadcrumb isDarkMode={isDarkMode} />;

  const saveBtn: JSX.Element = (
    <div className={`flex justify-end gap-5`}>
      {!isEditMode && (
        <Button
          onClick={onCancel}
          styleType="secondary"
          className="w-32 mobile:w-full"
        >
          <div className="flex items-center gap-2">
            <ResetIcon className="text-primary" />
            <span className="text-primary">{t("cancel")}</span>
          </div>
        </Button>
      )}
      <Button
        onClick={onSave}
        className={`w-32 ${isEditMode ? "mobile:w-44" : "w-full"}`}
      >
        <div className="flex items-center gap-2">
          <SaveIcon className="text-white" />
          <span className="text-white">{t("save")}</span>
        </div>
      </Button>
    </div>
  );

  const form: JSX.Element = (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center mobile:flex-col">
          {formData.image && (
            <img
              id="image"
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${formData.id}`}
              alt={t("imgNotFound")}
              className="w-40 rounded-lg object-contain"
            />
          )}
          <ImageSelector
            file={formData.image}
            onChange={(file: File) => {
              onInputChange("image", file);
              setIsImageUpdated(true);
            }}
            errorMessage={errors?.image?.message}
          />
          {isEditMode && !isImageUpdated ? (
            <span
              className={`transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("changeProfileImage")}
            </span>
          ) : (
            !formData.image && (
              <span
                className={`transition-all duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {t("selectProfileImage")}
              </span>
            )
          )}
        </div>
        <form
          onSubmit={onSave}
          className="flex flex-row flex-wrap justify-between gap-5"
        >
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.name}
              onChange={(value: string) => onInputChange("name", value)}
              isDarkMode={isDarkMode}
              placeholder={t("name")}
              width="100%"
              errorMessage={errors?.name?.message}
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.surname}
              onChange={(value: string) => onInputChange("surname", value)}
              isDarkMode={isDarkMode}
              placeholder={t("surname")}
              width="100%"
              errorMessage={errors?.surname?.message}
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.email as string}
              onChange={(value: string) => onInputChange("email", value)}
              isDarkMode={isDarkMode}
              placeholder={t("email")}
              width="100%"
              errorMessage={errors?.email?.message}
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.favouriteCard as string}
              onChange={(value: string) =>
                onInputChange("favouriteCard", value)
              }
              isDarkMode={isDarkMode}
              placeholder={t("favouriteCard")}
              width="100%"
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Autocomplete
              value={formData.favouriteDeck as TDeck}
              onChange={(value: TDeck) => onInputChange("favouriteDeck", value)}
              isDarkMode={isDarkMode}
              placeholder={t("favouriteDeck")}
              data={decks}
              width="100%"
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <DatePicker
              value={formData.birthDate as DateValue}
              onChange={(value: DateValue) => onInputChange("birthDate", value)}
              isDarkMode={isDarkMode}
              placeholder={t("birthDate")}
              width="100%"
            />
          </div>
          <div className="w-full">
            <Input
              value={formData.instagramLink as string}
              onChange={(value: string) =>
                onInputChange("instagramLink", value)
              }
              isDarkMode={isDarkMode}
              placeholder={t("instagramLink")}
              width="100%"
            />
          </div>
          <div className="w-full">
            <Textarea
              value={formData.description as string}
              onChange={(value: string) => onInputChange("description", value)}
              isDarkMode={isDarkMode}
              placeholder={t("description")}
              width="100%"
            />
          </div>
        </form>
      </div>
    </Card>
  );

  useEffect(() => {
    if (formData.image && typeof formData.image === "object") {
      let src: string = URL.createObjectURL(formData.image);
      let imagePreview: any = document.getElementById("image");
      if (imagePreview) imagePreview.src = src;
    }
  }, [formData.image]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title}
      {breadcrumb}
      {saveBtn}
      {form}
    </div>
  );
};

export default AdminPlayer;
