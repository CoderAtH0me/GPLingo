import en from "./en";
import uk from "./uk";
import ru from "./ru";

import { mergeLangs } from "../utils/merge";

import type { LocaleType } from "./en";

const ALL_LANGS = {
  en,
  uk,
  ru,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  en: "English",
  uk: "Українська",
  ru: "Русский",
};

const LANG_KEY = "GP-lang";
const DEFAULT_LANG = "en";

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
mergeLangs(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    //ignore
  }
}

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang() {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}
