
import Link from "next/link";
import { Button } from "./ui/button";
import { getI18n } from "../../locales/server";

export default async function HeroSection() {
  const t =await getI18n();

  return (
    <section className="relative bg-blue-50 py-16 bg-[url('/home.jpg')] bg-cover bg-fixed h-screen bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-1 container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('HeroSection.title')}
          </h1>
          <p className="text-xl mb-8 text-white">
            {t('HeroSection.description')}
          </p>
          <div className="flex sm:flex-row space-y-4 sm:space-y-0 space-x-4">
            <Link href="/login"><Button className='bg-indigo-800 hover:bg-indigo-900 p-6'>{t('HeroSection.login')}</Button></Link>
            <Link href="/login"><Button className='bg-white hover:bg-gray-200 text-black p-6'>{t('HeroSection.register')}</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
