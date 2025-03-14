import { FC, FormEvent, JSX, useState } from "react";
import { useTranslation } from "react-i18next";

// Assets
import logoImg from "../assets/images/logo.png";

// Components
import { Input, Button } from "../components";

// Icons
import {
  ClosedEyeIcon,
  EmailIcon,
  LockIcon,
  OpenedEyeIcon,
} from "../assets/icons";

// Utils
import { validateEmail, setPageTitle } from "../utils";

interface IFormData {
  email: string | null;
  password: string | null;
}

const initialState: IFormData = {
  email: null,
  password: null,
};

type TPassword = "text" | "password";

const Login: FC = () => {
  const [formData, setFormData] = useState<IFormData>(initialState);
  const [passwordType, setPasswordType] = useState<TPassword>("password");
  const { t } = useTranslation();

  setPageTitle("Log In");

  const onInputChange = (propLabel: string, value: string): void => {
    setFormData((prevState) => {
      return { ...prevState, [propLabel]: value };
    });
  };

  const logo: JSX.Element = (
    <img src={logoImg} alt={t("imgNotFound")} className="w-40" />
  );

  const onPasswordTypeChange = (): void => {
    switch (passwordType) {
      case "password": {
        setPasswordType("text");
        break;
      }
      case "text": {
        setPasswordType("password");
        break;
      }
    }
  };

  // TODO:
  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const isEmailValid: boolean = validateEmail(formData?.email as string);
    if (isEmailValid) {
    }
  }

  function isValid(value: string): boolean {
    if (value && value?.trim() !== "") return true;
    else return false;
  }

  const isBtnDisabled: boolean =
    !isValid(formData?.email as string) ||
    !isValid(formData?.password as string);

  const form: JSX.Element = (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 mobile:w-full">
      <Input
        value={formData?.email}
        onChange={(value: string) => onInputChange("email", value)}
        icon={<EmailIcon className="text-primary text-2xl" />}
        placeholder="E-mail"
      />
      <Input
        type={passwordType}
        value={formData?.password}
        onChange={(value: string) => onInputChange("password", value)}
        icon={<LockIcon className="text-primary text-2xl" />}
        endIcon={
          passwordType === "password" ? (
            <OpenedEyeIcon
              onClick={onPasswordTypeChange}
              className="text-gray text-2xl cursor-pointer"
            />
          ) : (
            <ClosedEyeIcon
              onClick={onPasswordTypeChange}
              className="text-gray text-2xl cursor-pointer"
            />
          )
        }
        placeholder="Password"
      />
      <Button type="submit" disabled={isBtnDisabled}>
        <span
          className={`text-lg uppercase ${
            isBtnDisabled ? "text-gray" : "text-white"
          }`}
        >
          Log In
        </span>
      </Button>
    </form>
  );

  const firstContainer: JSX.Element = (
    <div className="w-[65%] mobile:w-[90%] h-full flex justify-center items-center flex-col gap-10">
      {logo}
      {form}
    </div>
  );

  const secondContainer: JSX.Element = (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to top right, #FFFFFF 0%, #f37c90 50%, #f37c90 100%)",
      }}
      className="w-[35%] mobile:hidden h-full flex justify-center items-center"
    >
      <span className="text-white font-bold text-[4em]">
        {process.env.REACT_APP_WEBSITE_NAME}
      </span>
    </div>
  );

  return (
    <div className="w-full h-[100vh] mobile:h-[70vh] flex mobile:justify-center">
      {firstContainer}
      {secondContainer}
    </div>
  );
};

export default Login;
