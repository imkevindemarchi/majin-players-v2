import React, { FC, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

// Assets
import { SOCIAL_NAMES, SOCIALS, TSocial } from "../assets/constants";

// Contexts
import { ThemeContext, TThemeContext } from "../providers/theme.provider";

// Icons
import { InstagramIcon, YoutubeIcon } from "../assets/icons";

// Utils
import { setPageTitle } from "../utils";

interface ISocial {
  name: string;
  icon: ReactNode;
  link: string;
}

const Contacts: FC = () => {
  const { t } = useTranslation();
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;

  setPageTitle(t("contacts"));

  const Social = ({ name, icon, link, ...props }: ISocial) => {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="transition-all duration-300 flex items-center justify-center gap-2 bg-primary-transparent text-primary hover:bg-primary hover:text-white mobile:hover:bg-primary-transparent mobile:hover:text-primary p-5 rounded-full mobile:p-4"
        {...props}
      >
        {icon}
        <span className="text-2xl mobile:text-xl">{name}</span>
      </a>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <span
        className={`text-[3em] font-bold transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("contactsTitle")}
      </span>
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("contactsDescription")}
      </span>
      {SOCIALS.map((social: TSocial, index: number) => {
        return (
          <Social
            key={index}
            icon={
              social.name === SOCIAL_NAMES.instagram ? (
                <InstagramIcon className="text-[3em] mobile:text-[2em]" />
              ) : (
                social.name === SOCIAL_NAMES.youtube && (
                  <YoutubeIcon className="text-[3em] mobile:text-[2em]" />
                )
              )
            }
            name={social.name}
            link={social.link}
          />
        );
      })}
    </div>
  );
};

export default Contacts;
