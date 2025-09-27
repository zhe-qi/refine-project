import type { I18nProvider } from '@refinedev/core'
import { useTranslation } from 'react-i18next'

export const useI18nProvider = (): I18nProvider => {
  const { t, i18n } = useTranslation()

  return {
    translate: (key: string, options?: any) => t(key, options),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }
}