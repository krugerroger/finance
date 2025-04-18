//@ts-check
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useUser } from "@/app/[locale]/context/UserContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useI18n } from "../../../../../../locales/client"

type FormData = {
  nom_prenom: string
  pays: string
  adresse: string
  iban: string
  code_swift: string
  numero_de_compte: string
  monnaie: string
  adresse_banque: string
  nom_banque: string
}

export default function AddRecipient() {
  const { user } = useUser()
  const [editMode, setEditMode] = useState(false)
  const [radioValue, setRadioValue] = useState("iban")
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nom_prenom: "",
    pays: "",
    adresse: "",
    iban: "",
    code_swift: "",
    numero_de_compte: "",
    monnaie: "",
    adresse_banque: "",
    nom_banque: "",
  })
  const t = useI18n()

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  useEffect(() => {
    if (user?.bank_account?.length && !editMode) {
      const data = user.bank_account[0]
      setFormData({
        nom_prenom: data.account_holder_name,
        pays: data.country,
        adresse: data.beneficiary_address,
        iban: data.iban,
        code_swift: data.swift_bic,
        numero_de_compte: data.account_number,
        monnaie: data.currency_code,
        nom_banque: data.bank_name,
        adresse_banque: data.bank_address,
      })
      setRadioValue(data.account_type)
    }
  }, [user, editMode])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        user_id: user?.user_id,
        account_holder_name: formData.nom_prenom,
        beneficiary_address: formData.adresse,
        swift_bic: formData.code_swift,
        iban: formData.iban,
        country: formData.pays,
        account_number: formData.numero_de_compte,
        currency_code: formData.monnaie,
        bank_name: formData.nom_banque,
        bank_address: formData.adresse_banque,
        account_type: radioValue,
      }

      if (user?.bank_account?.length) {
        const { error: updateError } = await supabase
          .from('bank_accounts')
          .update(payload)
          .eq('user_id', user?.user_id)

        if (updateError) throw updateError

        toast.success(t('AddRecipientPage.messages.updateSuccess'))
      } else {
        const { error: insertError } = await supabase
          .from('bank_accounts')
          .insert(payload)

        if (insertError) throw insertError
        toast.success(t('AddRecipientPage.messages.addSuccess'))
      }

    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || t('AddRecipientPage.messages.error'))
      toast.error(t('AddRecipientPage.messages.error'))
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="md:text-xl text-sm font-bold">{t('AddRecipientPage.title')}</h1>  
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {error && (
          <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <Card>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {user?.bank_account?.length && !editMode ? (
                <div className="text-center space-y-1 mb-5">
                  {user?.bank_account?.map((account) => (
                    <div key={account.id} className="">
                      <h1 className="font-bold md:text-xl text-sm text-indigo-700 mb-5">
                        {t('AddRecipientPage.bankInfo.title')}
                      </h1>
                      <h4>
                        {t('AddRecipientPage.bankInfo.accountHolder')}: 
                        <span className="font-bold">{account.account_holder_name}</span>
                      </h4>
                      {t('AddRecipientPage.bankInfo.bankName')}: 
                      <span><b>{account.bank_name}</b></span>
                      {account.account_type === "iban" && (
                        <div>
                          <p>
                            {t('AddRecipientPage.bankInfo.iban')} 
                            <span className="font-bold">{account.iban.slice(0,4)}...{account.iban.slice(-4)}</span>
                          </p>
                          <p>
                            {t('AddRecipientPage.bankInfo.swiftBic')} 
                            <span className="font-bold">{account.swift_bic}</span>
                          </p>
                        </div>
                      )}
                      {account.account_type === "num_banc" && (
                        <p>
                          {t('AddRecipientPage.bankInfo.accountNumber')} 
                          <span className="font-bold">{account.account_number.slice(0,4)}...{account.account_number.slice(-4)}</span>
                        </p>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setEditMode(true)}>
                    {t('AddRecipientPage.form.updateDocuments')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label>{t('AddRecipientPage.form.selectCountry')}</Label>
                    <Select value={formData.pays} onValueChange={(value) => handleChange("pays", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t('AddRecipientPage.placeholders.country')} />
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
                    <Label>{t('AddRecipientPage.form.accountHolder')}</Label>
                    <Input 
                      value={formData.nom_prenom} 
                      required 
                      placeholder={t('AddRecipientPage.placeholders.accountHolder')}
                      onChange={(e) => handleChange("nom_prenom", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('AddRecipientPage.form.beneficiaryAddress')}</Label>
                    <Input 
                      value={formData.adresse} 
                      required 
                      placeholder={t('AddRecipientPage.placeholders.beneficiaryAddress')}
                      onChange={(e) => handleChange("adresse", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-gray-400">{t('AddRecipientPage.form.accountTypeLabel')}</h2>
                    <RadioGroup 
                      defaultValue="iban" 
                      onValueChange={setRadioValue} 
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center space-y-2 md:flex-row mb-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="iban" id="iban" />
                        <Label htmlFor="iban">
                          {t('AddRecipientPage.form.accountTypeOptions.iban')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="num_banc" id="num_banc" />
                        <Label htmlFor="num_banc">
                          {t('AddRecipientPage.form.accountTypeOptions.accountNumber')}
                        </Label>
                      </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {radioValue === "num_banc" && (
                    <div className="space-y-2">
                      <Label>{t('AddRecipientPage.form.accountNumber')}</Label>
                      <Input 
                        value={formData.numero_de_compte} 
                        required 
                        placeholder={t('AddRecipientPage.placeholders.accountNumber')}
                        onChange={(e) => handleChange("numero_de_compte", e.target.value)}
                      />
                    </div>
                  )}

                  {radioValue === "iban" && (
                    <div className="gap-4 flex">
                      <div className="space-y-2">
                        <Label>{t('AddRecipientPage.bankInfo.iban')}</Label>
                        <Input 
                          value={formData.iban} 
                          required 
                          placeholder={t('AddRecipientPage.placeholders.iban')}
                          onChange={(e) => handleChange("iban", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('AddRecipientPage.bankInfo.swiftBic')}</Label>
                        <Input 
                          value={formData.code_swift} 
                          required 
                          placeholder={t('AddRecipientPage.placeholders.swiftBic')}
                          onChange={(e) => handleChange("code_swift", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h2 className="text-sm text-gray-400">
                      {t('AddRecipientPage.form.bankInfoTitle')}
                    </h2>
                    <div className="flex gap-4 flex-col md:flex-row">
                      <div className="space-y-2">
                        <Label>{t('AddRecipientPage.form.bankName')}</Label>
                        <Input 
                          value={formData.nom_banque} 
                          required 
                          placeholder={t('AddRecipientPage.placeholders.bankName')}
                          onChange={(e) => handleChange("nom_banque", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">  
                        <Label>{t('AddRecipientPage.form.currency')}</Label>
                        <Select 
                          value={formData.monnaie} 
                          onValueChange={(value) => handleChange("monnaie", value)} 
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('AddRecipientPage.placeholders.currency')} />
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
                    </div>
                    <div className="space-y-2">
                      <Label>{t('AddRecipientPage.form.bankAddress')}</Label>
                      <Input 
                        value={formData.adresse_banque} 
                        required 
                        placeholder={t('AddRecipientPage.placeholders.bankAddress')}
                        onChange={(e) => handleChange("adresse_banque", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    {user?.bank_account?.length 
                      ? t('AddRecipientPage.form.updateButton') 
                      : t('AddRecipientPage.form.addButton')}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}