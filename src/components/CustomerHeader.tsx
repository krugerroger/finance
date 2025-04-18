'use client';
import { useUser } from "@/app/[locale]/context/UserContext";
import { DevicePhoneMobileIcon, EnvelopeIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "./ui/select"
import { CreditCardIcon, Star, UserIcon, Plus, CircleCheck, PhoneIcon } from "lucide-react"
import { SidebarTrigger } from "./ui/sidebar"
import Link from "next/link";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useI18n } from "../../locales/client";
import { LocaleSelect } from "./LocaleSelect";

export default function CustomerHeader() {
  const t = useI18n();
  const { user: currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-r-transparent"></div>
      </div>
    );
  }

  const fullName = currentUser
    ? `${currentUser.nom?.toUpperCase() || ''} ${currentUser.prenom?.toUpperCase() || ''}`.trim()
    : t('CustomerHeader.notConnected');

  const data = [
    {
      label: fullName,
      icon: <UserIcon className="h-10 w-10 text-gray-400" />,
      link: "/customer/account/show",
    },
    {
      label: t('CustomerHeader.menuItems.phone'),
      icon: <DevicePhoneMobileIcon className="h-10 w-10 text-gray-400" />,
      hasAdd: false,
      link: "/customer/account/show",
    },
    {
      label: t('CustomerHeader.menuItems.email'),
      icon: <EnvelopeIcon className="h-10 w-10 text-gray-400" />,
      hasAdd: false,
      link: "/customer/account/show",
    },
    {
      label: t('CustomerHeader.menuItems.debitCard'),
      icon: <CreditCardIcon className="h-10 w-10 text-gray-400" />,
      hasAdd: true,
      link: "/customer/cards/add"
    },
    {
      label: t('CustomerHeader.menuItems.transfer'),
      icon: <PaperAirplaneIcon className="h-10 w-10 text-gray-400" />,
      hasAdd: true,
      link: "/customer/transfert/add",
    },
  ];

  const formatCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return t('CustomerHeader.accountSection.lastViewed', {
      date: `${day}/${month}/${year} ${hours}:${minutes}`
    });
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <div className="mb-6">
      <div className="bg-indigo-700 flex items-center justify-between ms-auto text-white gap-5 font-semibold text-xs p-2">
      <div className="bg-white rounded-md flex justify-start items-center">
      <LocaleSelect className="bg-white ms-auto"/>
      </div>
       <div className="flex justtify-end">
       <div className="flex items-center gap-1">
          <EnvelopeIcon className="w-4"/>
          <span>{t('CustomerHeader.contactInfo.email')}</span>
        </div>
        <div className="flex items-center gap-1">
          <PhoneIcon className="w-4"/>
          <span>{t('CustomerHeader.contactInfo.phone')}</span>
        </div>
       </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
        <SidebarTrigger className=" " />
        <img src="/logo2.png" alt="Finance Logo" className="h-10" />
        <Button onClick={signout}>{t('CustomerHeader.logout')}</Button>
      </div>
      
      <div className="space-y-8">
        {/* Section Icônes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
          {data.map((item, index) => (
            <div key={index} className="group flex flex-col items-center space-y-2">
              <Link 
                href={item.link} 
                className={`relative rounded-full w-16 h-16 bg-gray-100 p-2 flex items-center justify-center transition-colors ${
                  item.hasAdd ? 'hover:bg-blue-100' : 'hover:bg-green-50'
                }`}
              >	
                {item.icon}
                {item.hasAdd && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                    <Plus className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                )}
                {item.hasAdd === false && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                    <CircleCheck className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </Link>
              <span className="text-sm font-medium text-center text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Section Compte */}
        <div className="container flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-white rounded-lg shadow-sm">
          <Select>
            <SelectTrigger className="w-[200px] hover:bg-gray-50 transition-colors">
              <SelectValue placeholder={currentUser?.numero_compte} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('CustomerHeader.accountSection.accountNumber')}</SelectLabel>
                <SelectItem value="eur">{currentUser?.numero_compte}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-green-600">
              € {currentUser?.solde},00
            </h4>
          </div>

          <div className="flex items-center gap-2 text-yellow-600">
            <Star className="fill-yellow-400 stroke-yellow-400" />
            <span className="font-medium">
              {t('CustomerHeader.accountSection.accountType')}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            {formatCurrentDate()}
          </div>
        </div>
      </div>
    </div>
  );
}