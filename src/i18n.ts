import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ko from "./lang/translation.ko.json";
import en from "./lang/translation.en.json";

const language = localStorage.getItem("language") || "ko";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: language, // 기본 언어
  fallbackLng: "ko", // 언어가 없을 경우 대체 언어
  debug: false,
  interpolation: {
    escapeValue: false, // React는 XSS 공격을 방지하기 위해 기본적으로 문자열을 이스케이프합니다.
  },
});

export default i18n;
