// components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Image from 'next/image'

const languageOptions = [
  {
    code: 'fr',
    name: 'Français',
    flag: '/flags/fr.svg' // Vous devrez créer un dossier public/flags avec les SVG des drapeaux
  },
  {
    code: 'en',
    name: 'English',
    flag: '/flags/gb.svg'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '/flags/de.svg'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '/flags/es.svg'
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '/flags/pt.svg'
  }
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLanguage = languageOptions.find(lang => lang.code === locale) || languageOptions[0]

  const changeLanguage = (newLocale: string) => {
    // Supprime la partie de locale actuelle du pathname
    const newPathname = pathname.replace(`/${locale}`, '') || '/'
    router.push(`/${newLocale}${newPathname}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            width={20}
            height={20}
            className="h-4 w-4"
          />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center gap-2"
          >
            <Image
              src={language.flag}
              alt={language.name}
              width={20}
              height={20}
              className="h-4 w-4"
            />
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}