
import { EnvelopeIcon, LanguageIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from './ui/button'
import { getI18n } from '../../locales/server'
import { LocaleSelect } from './LocaleSelect'

export default async function Header() {
  const t = await getI18n()

  return (
    <header className="bg-white shadow-sm">
       <LocaleSelect className="fixed top-0 left-0 z-50"/>
      <div className="text-[10px] bg-gray-100 p-2 flex justify-between items-center">
        <div className="flex justify-start">
          <MapPinIcon className="w-6 text-indigo-700" />
          {t('Header.address')}
        </div>
        <div className="flex flex-col md:flex-row justify-end gap-1 font-semibold text-indigo-900">
          <div className="flex items-center gap-1">
            <EnvelopeIcon className="w-4 text-indigo-900" />
            <span>{t('Header.email')}</span>
          </div>
          <div className="flex items-center gap-1">
            <PhoneIcon className="w-4" />
            {t('Header.phone')}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <img src="/logo2.png" alt="Finance Logo" className="h-10" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="#" className="text-gray-700 hover:text-blue-600">
            {t('Header.home')}
          </Link>
          <Link href="#credit_cards" className="text-gray-700 hover:text-blue-600">
            {t('Header.creditCard')}
          </Link>
          <Link href="#online_credit" className="text-gray-700 hover:text-blue-600">
            {t('Header.loan')}
          </Link>
          <Link href="#why_us" className="text-gray-700 hover:text-blue-600">
            {t('Header.insurance')}
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button className="bg-indigo-800 hover:bg-indigo-900">{t('Header.clientSpace')}</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
