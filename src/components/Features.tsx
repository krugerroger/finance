import Link from "next/link"
import { Button } from "./ui/button"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { getI18n } from "../../locales/server"

export default async function Features() {
  const t = await getI18n()

  const features = [
    {
      icon: '⭐⭐⭐⭐⭐',
      author: t('Features.testimonials.0.author'),
      country: t('Features.testimonials.0.country'),
      content: t('Features.testimonials.0.content')
    },
    {
      icon: '⭐⭐⭐⭐⭐',
      author: t('Features.testimonials.1.author'),
      country: t('Features.testimonials.1.country'),
      content: t('Features.testimonials.1.content')
    },
    {
      icon: '⭐⭐⭐⭐⭐',
      author: t('Features.testimonials.2.author'),
      country: t('Features.testimonials.2.country'),
      content: t('Features.testimonials.2.content')
    }
  ]

  const services = [
    {
      title: t('Features.services.0.title'),
      description: t('Features.services.0.description')
    },
    {
      title: t('Features.services.1.title'),
      description: t('Features.services.1.description')
    },
    {
      title: t('Features.services.2.title'),
      description: t('Features.services.2.description')
    }
  ]

  const loans = [
    {
      title: t('Features.onlineCredit.loans.0.title'),
      description: t('Features.onlineCredit.loans.0.description')
    },
    {
      title: t('Features.onlineCredit.loans.1.title'),
      description: t('Features.onlineCredit.loans.1.description')
    },
    {
      title: t('Features.onlineCredit.loans.2.title'),
      description: t('Features.onlineCredit.loans.2.description')
    }
  ]
  const creditCardItems = [
    t('Features.creditCards.items.0'),
    t('Features.creditCards.items.1'),
    t('Features.creditCards.items.2')
  ]

  return (
    <section className="py-16 bg-white">
      {/* Section Principale */}
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl font-bold mb-4">{t('Features.mainTitle')}</h2>
        <p>{t('Features.mainDescription')}</p>
        
        {/* Témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="text-md mb-4">{feature.icon}</div>
              <p className="text-gray-600">{feature.content}</p>
              <div className="mt-6">
                <p className="font-bold text-lg mt-4">{feature.author}</p>
                <p className="text-gray-500">{feature.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pourquoi nous choisir */}
      <div id="why_us" className=" sm:grid sm:grid-cols-3">
        <div className="px-6 py-10 bg-indigo-900 text-white col-span-2">
          <h6 className="text-xs">{t('Features.whyUs.subtitle')}</h6>
          <h1 className="text-4xl font-bold my-5">{t('Features.whyUs.title')}</h1>
          <p className="text-sm my-5">{t('Features.whyUs.description')}</p>
          <div className="my-6">
            <Link href="/login">
              <Button className="bg-white text-indigo-900 hover:bg-gray-200 p-6">
                {t('Features.whyUs.button')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-[url('/union.jpeg')] bg-cover bg-center col-span-1"></div>
      </div>

      {/* Services */}
      <div className="p-4">
        <h1 className="text-3xl text-center font-bold mx-auto sm:max-w-1/2 my-8">
          {t('Features.priorityTitle')}
        </h1>
        <div className="sm:grid sm:grid-cols-3 gap-4 p-6 space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border rounded space-y-2">
              <img 
                src={`/service${index+1}.jpg`} 
                className="w-full" 
                alt={service.title} 
              />
              <div className="p-4">
                <h1 className="font-bold text-lg">{service.title}</h1>
                <p className="text-xs">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cartes de crédit */}
      <div id="credit_cards" className=" sm:grid sm:grid-cols-3">
        <div className="bg-[url('/img1.jpeg')] bg-cover bg-center col-span-1"></div>
        <div className="px-6 py-10 bg-gray-900 text-white col-span-2">
          <h1 className="text-4xl font-bold my-5">{t('Features.creditCards.title')}</h1>
          <p className="text-sm my-5">{t('Features.creditCards.description')}</p>
          <div>
            {creditCardItems.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 text-indigo-700"/>
                {item}
              </p>
            ))}
          </div>
          <div className="my-6">
            <Link href="/login">
              <Button className="bg-indigo-800 text-white hover:bg-indigo-900 p-6">
                {t('Features.creditCards.button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Crédit en ligne */}
      <div id="online_credit" className="p-4">
        <h1 className="text-3xl text-center font-bold mx-auto sm:max-w-1/2 my-8">
          {t('Features.onlineCredit.title')}
        </h1>
        <p>{t('Features.onlineCredit.description')}</p>
        
        <div className="sm:grid sm:grid-cols-3 gap-4 space-y-4 my-5">
          {loans.map((loan, index) => (
            <div key={index} className="space-y-2 border rounded">
              <img 
                src={`/img${4-index}.webp`} 
                className="w-auto" 
                alt={loan.title} 
              />
              <div className="p-4">
                <h1 className="font-bold text-lg">{loan.title}</h1>
                <p className="text-xs">{loan.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}