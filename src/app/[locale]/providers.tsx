'use client'

import { PropsWithChildren } from "react"
import { I18nProviderClient } from "../../../locales/client" // Utilisez un alias propre

export function Providers({ children, locale }: PropsWithChildren<{ locale: string }>) {
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  )
}