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
    const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
  })

  const isStepOneValid = () => {
    const requiredFields = ["nom", "prenom", "telephone", "email", "sexe", "dateNaissance", "pays", "ville", "adresse"]
    return requiredFields.every(field => formData[field as keyof FormData]?.trim() !== "")
  }

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }


  
  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }


    if (!validatePhone(formData.telephone)) {
      setError("Veuillez entrer un numéro de téléphone valide")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {

      // 3. Création du compte bancaire dans la table 'accounts'
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
          solde: 0, // Solde initial à 0
          numero_compte: formData.monnaie +"-"+ Math.floor(Math.random() * 1000000000).toString(), // Génération d'un numéro de compte aléatoire
        })

      if (accountError) {
        throw accountError
      }
      toast.success("Inscription soumise pour validation", {
        description:("Votre inscription a été soumise avec succès. Vous recevrez un e-mail de confirmation une fois votre compte validé."),
        duration: 10000
      })

    } catch (error: any) {
      toast.error("Une erreur est survenue lors de l'inscription")
      console.error("Erreur d'inscription:", error)
      setError(error.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
   <div className="p-6">
    <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
            Ouvrir un compte
        </h1>
        <p className="text-center">
            Rejoignez Banque paribas en ouvrant votre compte bancaire en ligne ou dans l'une de nos agences. Gérez votre situation financière et vos activités en profitant des conseils de nos experts.   
        </p>
    </div>
    <form onSubmit={handleSubmit} className="">
        <div className="max-w-2xl mx-auto mt-10">
    {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
            <Card className=" shadow-lg p-6 rounded-2xl">
                <CardContent className="space-y-2 md:grid-cols-2 md:grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" value={formData.nom} placeholder="Entrez votre nom" onChange={(e) => handleChange("nom", e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input value={formData.prenom} placeholder="Entrez votre prénom" onChange={(e) => handleChange("prenom", e.target.value)} required/>
                </div>
                <div  className="space-y-2">
                    <Label htmlFor="telephone">Numéro de téléphone</Label>
                    <Input id="telephone" value={formData.telephone} type="tel" placeholder="+33 6 12 34 56 78" onChange={(e) => handleChange("telephone", e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={formData.email} type="email" placeholder="exemple@email.com" onChange={(e) => handleChange("email", e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sexe">Sexe</Label>
                    <Select value={formData.sexe} onValueChange={(value) => handleChange("sexe", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre sexe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="masculin">Masculin</SelectItem>
                        <SelectItem value="feminin">Féminin</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date de naissance</Label>
                    <Input id="date" value={formData.dateNaissance} type="date" onChange={(e) => handleChange("dateNaissance", e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select value={formData.pays} onValueChange={(value) => handleChange("pays", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un pays" />
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
                    <Label htmlFor="ville">Ville</Label>
                    <Input id="ville" value={formData.ville} placeholder="Entrez votre ville" onChange={(e) => handleChange("ville", e.target.value)} required/>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" value={formData.adresse} placeholder="Ex: 123 rue de Paris, 75000 Paris" onChange={(e) => handleChange("adresse", e.target.value)} required/>
                </div>
                <div className="md:col-span-2 text-right mt-4 space-x-2">
                <Button
                    type="button"
                    className="px-6 py-2 text-white"
                    onClick={() => {
                        if (isStepOneValid()) {
                        setCurrentStep(2);
                        } else {
                            setError("Veuillez remplir tous les champs obligatoires.");
                        }
                    }}
                    >
                    Étape suivante <ArrowRightIcon className="ml-2" />
                </Button>
                </div>
            </CardContent>
            </Card>
            </div>
        )}


        {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
            <Card className=" shadow-lg p-6 rounded-2xl">
            <CardContent className="space-y-4"> 
                <div className=" md:grid-cols-2 md:grid gap-4">
                <div className="space-y-2">
                    <Label>Type de compte</Label>
                    <Select value={formData.typeCompte} onValueChange={(value) => handleChange("typeCompte", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="epargne">Compte épargne</SelectItem>
                        <SelectItem value="courant">Compte courant</SelectItem>
                        <SelectItem value="business">Compte business</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">  
                    <Label htmlFor="monnaie">Devise monétaire</Label>
                    <Select value={formData.monnaie} onValueChange={(value) => handleChange("monnaie", value)} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
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
                    <Label htmlFor="langue">Langue Parlé</Label>
                    <Select value={formData.langue} onValueChange={(value) => handleChange("langue", value)} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une langue" />
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
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" placeholder="••••••••" type="password" onChange={(e) => handleChange("password", e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Comfirmer le mot de passe</Label>
                    <Input id="confirmPassword" placeholder="••••••••" type="password" onChange={(e) => handleChange("confirmPassword", e.target.value)} required/>
                </div>
                <div className="flex justify-between mt-4 space-x-2">
                <Button type="button" className="px-6 py-2 text-white" onClick={() => setCurrentStep(1)}>
                  <ArrowLeftIcon className="mr-2" /> Étape précédente
                </Button>
                <Button type="submit" className="px-6 py-2 text-white"  disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer compte"}
                </Button>
                </div>
                
            </CardContent>
            </Card>
        </div>
        )}
        </div>
            <div className=" my-5 md:col-span-2 max-w-2xl mx-auto">
                <p className="text-xs">Nous utilisons les informations que vous fournissez à des fins de gestion et d'administration, ainsi que pour vous tenir informé par courrier, téléphone, e-mail et SMS sur d'autres produits et services de notre part. Vous pouvez gérer vos préférences de manière proactive ou refuser de communiquer avec nous à tout moment. Vous avez le droit d'accéder à vos données que nous détenons ou de demander leur suppression. Pour plus de détails, veuillez <a href="#" className="text-blue-600 underline">politique de confidentialité</a>.</p>
            </div>
     </form>
   </div>
  )
}
