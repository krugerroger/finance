import Link from 'next/link'
import { getI18n } from "../../locales/server"

export default async function Footer() {
  const t = await getI18n()
  const currentYear = new Date().getFullYear()

  // Fonction helper pour gérer les tableaux de traductions
  const getTranslatedArray = (baseKey: string) => {
    const result = []
    let index = 0
    while (true) {
      const value = t(`${baseKey}.${index}` as any, {})
      // Si on obtient la clé au lieu de la valeur, on arrête
      if (value === `${baseKey}.${index}`) break
      result.push(value)
      index++
    }
    return result
  }

  // Récupération des liens sous forme de tableaux
  const financeLinks = getTranslatedArray('Footer.sections.finance.links')
  const investorLinks = getTranslatedArray('Footer.sections.investors.links')
  const legalLinks = getTranslatedArray('Footer.sections.legal.links')
  const contactLinks = getTranslatedArray('Footer.sections.contact.links')

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <img src="/logo2.png" alt="Finance Logo" className="h-10 mb-4" />
            <p className="text-gray-400 mb-6">{t('Footer.description')}</p>
            <p className='text-xs'>{t('Footer.smallText')}</p>
          </div>
          
          {/* Section Finance */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Footer.sections.finance.title')}</h3>
            <ul className="space-y-2">
              {financeLinks.map((link, index) => (
                <li key={index}>
                  <Link href="" className="text-gray-400 hover:text-white">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Investisseurs */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Footer.sections.investors.title')}</h3>
            <ul className="space-y-2">
              {investorLinks.map((link, index) => (
                <li key={index}>
                  <Link href="" className="text-gray-400 hover:text-white">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Légal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Footer.sections.legal.title')}</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href="" className="text-gray-400 hover:text-white">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Footer.sections.contact.title')}</h3>
            <p className='mb-6'>{t('Footer.sections.contact.description')}</p>
            <ul className="space-y-2">
              {contactLinks.map((link, index) => (
                <li key={index}>
                  <Link href="" className="text-gray-400 hover:text-white">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('Footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}