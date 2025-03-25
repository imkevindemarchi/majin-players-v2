export type TSocial = {
  name: string;
  link: string;
};

export type TSocialName = {
  instagram: string;
  youtube: string;
};

export const SOCIAL_NAMES: TSocialName = {
  instagram: "Instagram",
  youtube: "You Tube",
};

export const SOCIALS: TSocial[] = [
  {
    name: SOCIAL_NAMES.instagram,
    link: "https://www.instagram.com/majin.players/",
  },
  {
    name: SOCIAL_NAMES.youtube,
    link: "https://www.youtube.com/@majin.players",
  },
];

export const MONTHS: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
