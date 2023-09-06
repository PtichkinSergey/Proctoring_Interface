import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Eng from "./localization/eng.json"

const resources = {
    eng: {
        translation: Eng
    }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;