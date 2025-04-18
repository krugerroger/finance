'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/app/[locale]/context/UserContext"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useI18n } from "../../../../../../locales/client"

type FormData = {
  holder_name: string
  card_number: string
  date_expiration: string
  cvv: string
}

export default function AddCards() {
  const { user } = useUser()
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    holder_name: "",
    card_number: "",
    date_expiration: "",
    cvv: "",
  })
  const t = useI18n()

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  useEffect(() => {
    if (user?.cards?.length && !editMode) {
      const data = user.cards[0]
      setFormData({
        holder_name: data.cardholder_name,
        card_number: data.card_number,
        cvv: data.cvv,
        date_expiration: data.date_expiration,
      })
    }
  }, [user, editMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        user_id: user?.user_id,
        cardholder_name: formData.holder_name,
        card_number: formData.card_number,
        date_expiration: formData.date_expiration,
        cvv: formData.cvv,
      }

      if (user?.cards?.length) {
        const { error: updateError } = await supabase
          .from('user_cards')
          .update(payload)
          .eq('user_id', user?.user_id)

        if (updateError) throw updateError

        toast.success(t('AddCardsPage.messages.updateSuccess'))
      } else {
        const { error: insertError } = await supabase
          .from('user_cards')
          .insert(payload)

        if (insertError) throw insertError
        toast.success(t('AddCardsPage.messages.addSuccess'))
      }

    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || t('AddCardsPage.messages.error'))
      toast.error(t('AddCardsPage.messages.error'))
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">
          {t('AddCardsPage.title')}
        </h1>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} action="">
              {user?.cards?.length && !editMode ? (
                <div className="text-center space-y-1 mb-5">
                  {user?.cards?.map((card) => (
                    <div key={card.id} className="">
                      <h1 className="font-bold text-xl text-indigo-700 mb-5">
                        {t('AddCardsPage.cardInfo.title')}
                      </h1>
                      <h4>
                        {t('AddCardsPage.cardInfo.accountHolder')} :  
                        <span className="font-bold"> {card.cardholder_name}</span>
                      </h4>
                      <p>
                        {t('AddCardsPage.cardInfo.cardNumber')} :
                        <span className="font-bold"> {card.card_number.slice(0,4)}...{card.card_number.slice(-4)}</span>
                      </p>
                      <p>
                        {t('AddCardsPage.cardInfo.expiryDate')} :
                        <span className="font-bold"> {card.date_expiration}</span>
                      </p>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setEditMode(true)}>
                    {t('AddCardsPage.form.updateDocuments')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card_holder" className="block text-sm font-medium">
                      {t('AddCardsPage.form.cardHolder')}
                    </Label>
                    <Input 
                      value={formData.holder_name} 
                      type="text" 
                      id="card_holder" 
                      placeholder={t('AddCardsPage.placeholders.cardHolder')} 
                      className="border rounded-md p-2 w-full" 
                      required 
                      onChange={(e) => handleChange("holder_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card_number" className="block text-sm font-medium">
                      {t('AddCardsPage.form.cardNumber')}
                    </Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      placeholder={t('AddCardsPage.placeholders.cardNumber')}
                      pattern="\d{4} \d{4} \d{4} \d{4}"
                      required
                      onChange={(e) => handleChange("card_number", e.target.value)}
                      onInput={(e) => {
                        const input = e.currentTarget
                        let value = input.value.replace(/\D/g, "")
                        value = value.match(/.{1,4}/g)?.join(" ") ?? value
                        input.value = value
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date" className="block text-sm font-medium">
                      {t('AddCardsPage.form.expiryDate')}
                    </Label>
                    <Input
                      type="text"
                      placeholder={t('AddCardsPage.placeholders.expiryDate')}
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                      required
                      value={formData.date_expiration}
                      onChange={(e) => handleChange("date_expiration", e.target.value)}
                      onInput={(e) => {
                        const input = e.currentTarget
                        let value = input.value.replace(/[^\d]/g, "")
                        if (value.length >= 3) {
                          value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
                        }
                        input.value = value
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="block text-sm font-medium">
                      {t('AddCardsPage.form.cvv')}
                    </Label>
                    <Input 
                      value={formData.cvv} 
                      type="text" 
                      id="cvv" 
                      placeholder={t('AddCardsPage.placeholders.cvv')} 
                      className="border rounded-md p-2 w-full" 
                      required 
                      onChange={(e) => handleChange("cvv", e.target.value)}
                    />
                  </div>
                  <Button type="submit">
                    {user?.cards?.length 
                      ? t('AddCardsPage.form.updateButton') 
                      : t('AddCardsPage.form.addButton')}
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