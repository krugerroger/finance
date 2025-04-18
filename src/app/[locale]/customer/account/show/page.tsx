'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleCheck, KeyRound, Mail, User, Calendar, Smartphone, Home, Transgender, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/[locale]/context/UserContext";
import { useI18n } from "../../../../../../locales/client";

export default function ShowAccount() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [error] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading, supabase } = useUser();
  const t = useI18n();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, ) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
  }

  const personalData = [
    { 
      label: t('ShowAccount.personalData.accountNumber'), 
      value: user?.numero_compte, 
      icon: <User className="h-4 w-4 mr-2" />,
      editable: false
    },
    { 
      label: t('ShowAccount.personalData.fullName'), 
      value: user?.nom?.toUpperCase()+" "+ user?.prenom?.toUpperCase(), 
      icon: <User className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/profile/edit/name"
    },
    { 
      label: t('ShowAccount.personalData.birthDate'), 
      value: user?.date_naissance, 
      icon: <Calendar className="h-4 w-4 mr-2" />,
      editable: false
    },
    { 
      label: t('ShowAccount.personalData.gender'), 
      value: user?.sexe === 'male' ? t('ShowAccount.genderOptions.male') : t('ShowAccount.genderOptions.female'), 
      icon: <Transgender className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/profile/edit/gender"
    },
    { 
      label: t('ShowAccount.personalData.address'), 
      value: user?.adresse, 
      icon: <Home className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/profile/edit/address"
    },
    { 
      label: t('ShowAccount.personalData.phone'), 
      value: user?.telephone, 
      icon: <Smartphone className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/profile/edit/phone"
    },
    { 
      label: t('ShowAccount.personalData.accountStatus'), 
      value: t('ShowAccount.personalData.activeAccount'),
      icon: <CircleCheck className={`h-4 w-4 mr-2 text-green-600 text-gray-400`} />,
      editable: false
    },
  ];

  const securityData = [
    { 
      label: t('ShowAccount.securityData.email'), 
      value: user?.email, 
      icon: <Mail className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/security/edit/email"
    },
    { 
      label: t('ShowAccount.securityData.accountType'), 
      value: `${t('ShowAccount.securityData.accountType')} ${user?.type_compte} (${user?.monnaie?.toUpperCase()})`, 
      icon: <User className="h-4 w-4 mr-2" />,
      editable: false
    },
    { 
      label: t('ShowAccount.securityData.password'), 
      value: "••••••••", 
      highlight: true, 
      icon: <KeyRound className="h-4 w-4 mr-2" />,
      editable: true,
      editLink: "/security/change-password",
      action: (
        <Link href="/security/change-password" passHref>
          <Button variant="outline" size="sm" className="ml-4">
            <Edit className="h-3 w-3 mr-1" />
            {t('ShowAccount.securityData.change')}
          </Button>
        </Link>
      )
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('ShowAccount.title')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex-1 p-4 text-center font-medium transition-colors ${currentStep === 1 ? "bg-gray-50 text-primary border-b-2 border-primary" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {t('ShowAccount.tabs.personalProfile')}
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex-1 p-4 text-center font-medium transition-colors ${currentStep === 2 ? "bg-gray-50 text-primary border-b-2 border-primary" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {t('ShowAccount.tabs.loginSecurity')}
            </button>
          </div>
          
          {currentStep === 1 && (
            <div className="p-6 space-y-4">
              {personalData.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className={`flex items-center justify-between col-span-2 p-2 rounded text-green-600 font-medium`}>
                    <div className="flex items-center">
                      {item.value}
                    </div>
                    {item.editable && (
                      <Link href={item.editLink || "#"} passHref>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                          <Edit className="h-3 w-3 mr-1" />
                          {t('ShowAccount.securityData.edit')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="p-6 space-y-4">
              {securityData.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className={`flex items-center justify-between col-span-2 p-2 rounded ${item.highlight ? "text-green-600 font-medium" : ""}`}>
                    <div className="flex items-center">
                      {item.highlight && item.icon}
                      {item.value}
                    </div>
                    {item.editable ? (
                      item.action || (
                        <Link href={item.editLink || "#"} passHref>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            <Edit className="h-3 w-3 mr-1" />
                            {t('ShowAccount.securityData.edit')}
                          </Button>
                        </Link>
                      )
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-gray-50 px-6 py-3 border-t">
            <p className="text-xs text-gray-500">
              {t('ShowAccount.footerNote')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}