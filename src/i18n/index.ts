import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import detector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['zh', 'en'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'zh', // 默认语言设置为中文
    lng: 'zh', // 初始语言设置为中文
    interpolation: {
      escapeValue: false, // React已经自动转义了
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n