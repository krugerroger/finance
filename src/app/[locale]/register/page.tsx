// components/InscriptionForm.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useI18n } from "../../../../locales/client"
import Link from "next/link"

type FormData = {
  nom: string
  prenom: string
  telephone: string
  email: string
  sexe: string
  dateNaissance: string
  pays: string
  ville: string
  adresse: string
  typeCompte: string
  monnaie: string
  langue: string
  password: string
  confirmPassword: string
}

export default function RegistrationForm() {
    const t = useI18n();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      sexe: "",
      dateNaissance: "",
      pays: "",
      ville: "",
      adresse: "",
      typeCompte: "",
      monnaie: "",
      langue: "",
      password: "",
      confirmPassword: "",
    });
  
    const handleChange = (key: keyof FormData, value: string) => {
      setFormData(prev => ({ ...prev, [key]: value }));
      if (error) setError(null);
    };
    const isStepOneValid = () => {
        const requiredFields = ["nom", "prenom", "telephone", "email", "sexe", "dateNaissance", "pays", "ville", "adresse"]
        return requiredFields.every(field => formData[field as keyof FormData]?.trim() !== "")
      }
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        setError(t('Registration.errors.passwordMismatch'));
        return;
      }
  
      setIsSubmitting(true);
      setError(null);
  
      try {
        const { error: accountError } = await supabase
          .from('pending_users')
          .insert({
            email: formData.email,
            password: formData.password,
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            sexe: formData.sexe,
            date_naissance: formData.dateNaissance,
            pays: formData.pays,
            ville: formData.ville,
            adresse: formData.adresse,
            type_compte: formData.typeCompte,
            monnaie: formData.monnaie,
            langue: formData.langue,
            solde: 0,
            numero_compte: formData.monnaie +"-"+ Math.floor(Math.random() * 1000000000).toString(),
          });
  
        if (accountError) throw accountError;
  
        toast.success(t('Registration.success.title'), {
          description: t('Registration.success.message'),
          duration: 10000
        });
  
      } catch (error: any) {
        toast.error(t('Registration.errors.registrationError'));
        setError(error.message || t('Registration.errors.registrationError'));
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
        <div className=" flex justify-center items-center mb-4">
            <Link href="/"><img src="/logo2.png" alt="Finance Logo" className="h-10" /></Link>
        </div>
          <h1 className="text-4xl font-bold mb-6 text-center">
            {t('Registration.title')}
          </h1>
          <p className="text-center">
            {t('Registration.description')}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="">
          <div className="max-w-2xl mx-auto mt-10">
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            
            {currentStep === 1 && (
              <Card className="shadow-lg p-6 rounded-2xl">
                <CardContent className="space-y-2 md:grid-cols-2 md:grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">{t('Registration.form.lastName')}</Label>
                    <Input 
                      id="nom" 
                      value={formData.nom} 
                      placeholder={t('Registration.form.lastName')} 
                      onChange={(e) => handleChange("nom", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Registration.form.firstName')}</Label>
                    <Input 
                      value={formData.prenom} 
                      placeholder={t('Registration.form.firstName')} 
                      onChange={(e) => handleChange("prenom", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">{t('Registration.form.phone')}</Label>
                    <Input 
                      id="telephone" 
                      value={formData.telephone} 
                      type="tel" 
                      placeholder="+33 6 12 34 56 78" 
                      onChange={(e) => handleChange("telephone", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('Registration.form.email')}</Label>
                    <Input 
                      id="email" 
                      value={formData.email} 
                      type="email" 
                      placeholder="exemple@email.com" 
                      onChange={(e) => handleChange("email", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexe">{t('Registration.form.gender')}</Label>
                    <Select 
                      value={formData.sexe} 
                      onValueChange={(value) => handleChange("sexe", value)} 
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Registration.form.gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculin">{t('Registration.form.genderOptions.male')}</SelectItem>
                        <SelectItem value="feminin">{t('Registration.form.genderOptions.female')}</SelectItem>
                        <SelectItem value="autre">{t('Registration.form.genderOptions.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('Registration.form.birthDate')}</Label>
                    <Input 
                      id="date" 
                      value={formData.dateNaissance} 
                      type="date" 
                      onChange={(e) => handleChange("dateNaissance", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">{t('Registration.form.country')}</Label>
                    <Select 
                      value={formData.pays} 
                      onValueChange={(value) => handleChange("pays", value)} 
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Registration.form.country')} />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="AL">Albania</SelectItem>
                        <SelectItem value="BE">Belgium</SelectItem>
                        <SelectItem value="BA">Bosnia and Herzegovina</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="EC">Ecuador</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="PF">French Polynesia</SelectItem>
                        <SelectItem value="TF">French Southern Territories</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="GP">Guadeloupe</SelectItem>
                        <SelectItem value="GT">Guatemala</SelectItem>
                        <SelectItem value="CI">Ivory Coast</SelectItem>
                        <SelectItem value="MG">Madagascar</SelectItem>
                        <SelectItem value="MQ">Martinique</SelectItem>
                        <SelectItem value="NC">New Caledonia</SelectItem>
                        <SelectItem value="NO">Norway</SelectItem>
                        <SelectItem value="PT">Portugal</SelectItem>
                        <SelectItem value="RE">Reunion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ville">{t('Registration.form.city')}</Label>
                    <Input 
                      id="ville" 
                      value={formData.ville} 
                      placeholder={t('Registration.form.city')} 
                      onChange={(e) => handleChange("ville", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="adresse">{t('Registration.form.address')}</Label>
                    <Input 
                      id="adresse" 
                      value={formData.adresse} 
                      placeholder={t('Registration.form.address')} 
                      onChange={(e) => handleChange("adresse", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="md:col-span-2 text-right mt-4 space-x-2">
                    <Button
                      type="button"
                      className="px-6 py-2 text-white"
                      onClick={() => {
                        if (isStepOneValid()) {
                          setCurrentStep(2);
                        } else {
                          setError(t('Registration.errors.requiredFields'));
                        }
                      }}
                    >
                      {t('Registration.form.nextButton')} <ArrowRightIcon className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
  
            {currentStep === 2 && (
              <Card className="shadow-lg p-6 rounded-2xl">
                <CardContent className="space-y-4"> 
                  <div className="md:grid-cols-2 md:grid gap-4">
                    <div className="space-y-2">
                      <Label>{t('Registration.form.accountType')}</Label>
                      <Select 
                        value={formData.typeCompte} 
                        onValueChange={(value) => handleChange("typeCompte", value)} 
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('Registration.form.accountType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="epargne">{t('Registration.form.accountTypeOptions.savings')}</SelectItem>
                          <SelectItem value="courant">{t('Registration.form.accountTypeOptions.current')}</SelectItem>
                          <SelectItem value="business">{t('Registration.form.accountTypeOptions.business')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">  
                      <Label htmlFor="monnaie">{t('Registration.form.currency')}</Label>
                      <Select 
                        value={formData.monnaie} 
                        onValueChange={(value) => handleChange("monnaie", value)} 
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('Registration.form.currency')} />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="EUR">Eur(€)</SelectItem>
                                <SelectItem value="CHF">CHF</SelectItem>
                                <SelectItem value="NOK">NOK(kr)</SelectItem>
                                <SelectItem value="PLN">PLN</SelectItem>
                                <SelectItem value="USD">USD($)</SelectItem>
                                <SelectItem value="XOF">XOF(FCFA)</SelectItem>
                                <SelectItem value="XPF">XPF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">  
                      <Label htmlFor="langue">{t('Registration.form.language')}</Label>
                      <Select 
                        value={formData.langue} 
                        onValueChange={(value) => handleChange("langue", value)} 
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('Registration.form.language')} />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="en">English (en)</SelectItem>
                                <SelectItem value="fr">Français(fr)</SelectItem>
                                <SelectItem value="es">Espanol(es)</SelectItem>
                                <SelectItem value="it">Italiano(it)</SelectItem>
                                <SelectItem value="pt">Portuguès(pt)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('Registration.form.password')}</Label>
                    <Input 
                      id="password" 
                      placeholder="••••••••" 
                      type="password" 
                      onChange={(e) => handleChange("password", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('Registration.form.confirmPassword')}</Label>
                    <Input 
                      id="confirmPassword" 
                      placeholder="••••••••" 
                      type="password" 
                      onChange={(e) => handleChange("confirmPassword", e.target.value)} 
                      required
                    />
                  </div>
                  <div className="flex justify-between mt-4 space-x-2">
                    <Button 
                      type="button" 
                      className="px-6 py-2 text-white" 
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeftIcon className="mr-2" /> {t('Registration.form.previousButton')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="px-6 py-2 text-white"  
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('Registration.form.submitting') : t('Registration.form.submitButton')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
           <div className="my-3 text-center"> <Link href="/login"><Button variant="link">{t('LoginPage.title')}</Button></Link></div>
          </div>
          
          <div className="my-5 md:col-span-2 max-w-2xl mx-auto">
            <p className="text-xs">
              {t('Registration.privacyPolicy', {
                privacyPolicy: (
                  <Link href="#" className="text-blue-600 underline">
                    {t('privacyPolicy' as any, {})}
                  </Link>
                )
              })}
            </p>
          </div>
        </form>
      </div>
    );
  }