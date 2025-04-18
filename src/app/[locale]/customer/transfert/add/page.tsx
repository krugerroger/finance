// @ts-check
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BanknotesIcon, CreditCardIcon, CurrencyEuroIcon, InformationCircleIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/[locale]/context/UserContext"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useI18n } from "../../../../../../locales/client"

type TransferMethod = "card" | "bank" | "paypal"
type PaypalOption = "add_paypal" | "select_paypal"
type TransferStatus = "pending" | "processing" | "completed"

type Transfert = {
  user_id: string
  method: TransferMethod
  amount: number
  status: TransferStatus
  nom: string
  selected_account?: string
}

export default function AddTransfer() {
  const t = useI18n()
  const { user, isLoading } = useUser()
  const router = useRouter()
  
  const [errors, setErrors] = useState({
    amount: '',
    form: ''
  })
  
  const [selectedMethod, setSelectedMethod] = useState<TransferMethod>("bank")
  const [paypalOption, setPaypalOption] = useState<PaypalOption>("add_paypal")
  
  const [formState, setFormState] = useState({
    amount: 0,
    accountHolder: user ? `${user.nom?.toUpperCase()} ${user.prenom?.toUpperCase()}` : "",
    paypalEmail: "",
    selectedAccount: "",
    selectedCard: "", 
    selectedPaypal: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(33)

  const validateAmount = (amount: number) => {
    if (!amount || amount <= 0) {
      setErrors(prev => ({...prev, amount: t('Errors.amount.invalid')}))
      return false
    }
    if (amount > (user?.solde || 0)) {
      setErrors(prev => ({...prev, amount: t('Errors.amount.insufficient', { balance: user?.solde })}))
      return false
    }
    if (amount < 10) {
      setErrors(prev => ({...prev, amount: t('Errors.amount.minimum')}))
      return false
    }
    setErrors(prev => ({...prev, amount: ''}))
    return true
  }

  const handleInputChange = (field: keyof typeof formState, value: string | number) => {
    if (field === 'amount') {
      validateAmount(typeof value === 'string' ? Number(value) : value)
    }
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const addPaypalAccount = async () => {
    if (!formState.paypalEmail) {
      setErrors(prev => ({...prev, form: t('Errors.form.paypalEmail')}))
      return
    }

    try {
      const { error } = await supabase
        .from('paypal_accounts')
        .insert({
          user_id: user?.user_id,
          paypal_email: formState.paypalEmail
        })

      if (error) throw error

      toast.success(t('Toast.paypalSuccess'), {
        description: t('Toast.paypalDescription', { email: formState.paypalEmail }),
        duration: 5000
      })
      
      setFormState(prev => ({ ...prev, paypalEmail: "" }))
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte PayPal:", error)
      setErrors(prev => ({...prev, form: t('Errors.form.transferError')}))
      toast.error(t('Toast.transferError'), {
        description: t('Toast.errorDescription'),
        duration: 5000
      })
    }
  }

  const handleSubmitTransfer = async () => {
    if (!user) return

    if (!validateAmount(formState.amount)) return
    
    if (selectedMethod === "bank" && !formState.selectedAccount) {
      setErrors(prev => ({...prev, form: t('Errors.form.recipientRequired')}))
      return
    }
    if (selectedMethod === "card" && !formState.selectedCard) {
      setErrors(prev => ({...prev, form: t('Errors.form.cardRequired')}))
      return
    }
    if (selectedMethod === "paypal" && !formState.selectedPaypal) {
      setErrors(prev => ({...prev, form: t('Errors.form.paypalRequired')}))
      return
    }

    setIsSubmitting(true)
    setErrors(prev => ({...prev, form: ''}))

    try {
      const final_solde = user?.solde ? user?.solde - formState.amount : user?.solde
      
      if (final_solde && final_solde < 0) {
        toast.warning(t('Toast.insufficientBalance'), {
          description: t('Toast.insufficientDescription'),
          duration: 5000
        })
        setIsSubmitting(false)
        return
      }
      
      const transferData: Transfert = {
        user_id: user.user_id,
        method: selectedMethod,
        amount: formState.amount,
        nom: user.nom && user.prenom || "",
        status: "pending",
        selected_account: {
          paypal: formState.selectedPaypal,
          card: formState.selectedCard,
          bank: formState.selectedAccount,
        }[selectedMethod]
      }

      if (user?.transfersData?.find(t => t.status === "pending")?.status === "pending") {
        toast.warning(t('Toast.pendingTransfer'), {
          description: t('Toast.pendingDescription'),
          duration: 5000
        })
        setIsSubmitting(false)
        return
      }
      
      const { error } = await supabase.from('transfers').insert(transferData)
      if (error) throw error

      toast.success(t('Toast.transferSuccess'), {
        description: t('Toast.transferDescription', { amount: formState.amount }),
        duration: 5000
      })

      await supabase
        .from('accounts')
        .update({ solde: final_solde })
        .eq('user_id', user.user_id)

      // Reset form
      setFormState({
        amount: 0,
        accountHolder: `${user?.nom?.toUpperCase()} ${user?.prenom?.toUpperCase()}`,
        paypalEmail: "",
        selectedAccount: "",
        selectedCard: "",
        selectedPaypal: "",
      })
      
      router.push('/customer/transfert/detail')
    } catch (error) {
      console.error("Erreur lors du transfert:", error)
      setErrors(prev => ({...prev, form: t('Errors.form.transferError')}))
      toast.error(t('Toast.transferError'), {
        description: t('Toast.errorDescription'),
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const newProgress = formState.amount > 0 && !errors.amount ? 66 : 33
    setProgress(newProgress)
  }, [formState.amount, errors.amount])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">...</div>
  }

return (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="flex border rounded-lg mb-8 overflow-hidden text-white ">
      <span className="inline-block text-sm bg-indigo-700 md:text-xl text-center w-1/3 p-2 font-medium">
        {t('TransferProgress.initialization')}
      </span>
      <span className="inline-block text-sm md:text-xl w-1/3 p-2 text-center bg-gray-900">
        {t('TransferProgress.inProgress')}
      </span>
      <span className="inline-block text-sm md:text-xl w-1/3 p-2 text-center bg-gray-900">
        {t('TransferProgress.completed')}
      </span>
    </div>
    
    <h1 className="text-2xl font-bold mb-6">{t('Transfer.newTransfer')}</h1>
    
    <div className="mb-8 space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className={progress >= 33 ? "text-primary font-medium" : ""}>
          {t('Transfer.method')}
        </span>
        <span className={progress >= 66 ? "text-primary font-medium" : ""}>
          {t('Transfer.amount')}
        </span>
        <span className={progress >= 100 ? "text-primary font-medium" : ""}>
          {t('Transfer.confirmation')}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
    
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">1</span>
            {t('Transfer.transferMethod')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mb-6 sm:flex-row">
            <Button 
              variant={selectedMethod === "bank" ? "default" : "outline"} 
              onClick={() => setSelectedMethod("bank")} 
              className="flex-1 flex items-center gap-2 h-14"
            >
              <BanknotesIcon className="h-5 w-5" />
              {t('Transfer.bankAccount')}
            </Button>
            <Button 
              variant={selectedMethod === "card" ? "default" : "outline"} 
              onClick={() => setSelectedMethod("card")} 
              className="flex-1 flex items-center gap-2 h-14"
            >
              <CreditCardIcon className="h-5 w-5" />
              {t('Transfer.bankCard')}
            </Button>
            <Button 
              variant={selectedMethod === "paypal" ? "default" : "outline"} 
              onClick={() => setSelectedMethod("paypal")} 
              className="flex-1 flex items-center gap-2 h-14"
            >
              <CurrencyEuroIcon className="h-5 w-5" />
              Paypal
            </Button>
          </div>

          {selectedMethod === "bank" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('Transfer.recipientAccount')}</Label>
                <Select 
                  value={formState.selectedAccount}
                  onValueChange={v => handleInputChange('selectedAccount', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Transfer.selectRecipient')} />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.bank_account?.length ? (
                      user.bank_account.map(beneficiary => (
                        <SelectItem 
                          key={beneficiary.id} 
                          value={beneficiary.iban}
                        >
                          <div className="flex flex-col">
                            <span>{beneficiary.account_holder_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {beneficiary.iban} • {beneficiary.bank_name}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="aucun" disabled>
                        {t('Transfer.noRecipients')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <InformationCircleIcon className="h-4 w-4" />
                  <span>{t('Transfer.verificationTime')}</span>
                </div>
                
                <Link href="/customer/recipient/add">
                  <Button variant="outline" className="w-full">
                    {t('Transfer.addNewRecipient')}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {selectedMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('Transfer.registeredCards')}</Label>
                <Select 
                  value={formState.selectedCard}
                  onValueChange={v => handleInputChange('selectedCard', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Transfer.selectCard')} />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.cards?.length ? (
                      user.cards.map(card => (
                        <SelectItem 
                          key={card.card_number} 
                          value={card.card_number}
                        >
                          <div className="flex flex-col">
                            <span>Credit card •••• {card.card_number.slice(-4)}</span>
                            <span className="text-xs text-muted-foreground">Expire {card.date_expiration}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="aucun" disabled>
                        {t('Transfer.noCards')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <Link href="/customer/cards/add">
                <Button variant="outline" className="w-full">
                  {t('Transfer.addNewCard')}
                </Button>
              </Link>
            </div>
          )}

          {selectedMethod === "paypal" && (
            <div className="space-y-4">
              <RadioGroup 
                value={paypalOption} 
                onValueChange={(value: PaypalOption) => setPaypalOption(value)} 
                className=""
              >
                <div className="flex flex-col items-center space-y-2 md:flex-row mb-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="add_paypal" id="add_paypal" />
                    {t('Transfer.addPaypalAccount')}
                  </Label>
                  {paypalOption === "add_paypal" && (
                    <div className="space-y-2">
                      <Input 
                        type="email"
                        placeholder="email@paypal.com"
                        value={formState.paypalEmail}
                        onChange={e => handleInputChange('paypalEmail', e.target.value)}
                      />
                      <Button onClick={addPaypalAccount}>
                        {t('Transfer.addPaypalAccount')}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="select_paypal" id="select_paypal" />
                    {t('Transfer.selectPaypalAccount')}
                  </Label>
                  {paypalOption === "select_paypal" && (
                    <Select 
                      value={formState.selectedPaypal}
                      onValueChange={v => handleInputChange('selectedPaypal', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Transfer.selectPaypalAccount')} />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.paypalAccount?.length ? (
                          user.paypalAccount.map(account => (
                            <SelectItem 
                              key={account.paypal_email} 
                              value={account.paypal_email}
                            >
                              {account.paypal_email}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="aucun" disabled>
                            {t('Transfer.noPaypalAccount')}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">2</span>
            {t('Transfer.transferAmount')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('Transfer.sourceAccount')}</Label>
            <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              <p className="text-base font-medium">{user?.nom?.toUpperCase()} {user?.prenom?.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">
                {t('Transfer.availableBalance')}: € {user?.solde}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>{t('Transfer.transferAmount')}</Label>
              <span className="text-sm text-muted-foreground">
                {t('Transfer.availableBalance')}: € {user?.solde}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">€</span>
              </div>
              <Input
                className="pl-8 md:text-lg py-3 md:py-6"
                value={formState.amount}
                onChange={e => handleInputChange('amount', e.target.value)}
                type="number"
                min="10"
                max={user?.solde}
                placeholder="0.00"
              />
            </div>
            
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
            
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('Transfer.minimum')}: €10.00
                </span>
                <span className="text-muted-foreground">
                  {t('Transfer.maximum')}: €{user?.solde}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            {errors.form && (
              <p className="text-sm text-destructive mb-2">{errors.form}</p>
            )}
            
            <Button 
              onClick={handleSubmitTransfer}
              className="w-full py-3 text-sm md:text-lg"
              disabled={isSubmitting || !!errors.amount || !formState.amount || (!formState.selectedAccount && selectedMethod === "bank") || (!formState.selectedCard && selectedMethod === "card") || (!formState.selectedPaypal && selectedMethod === "paypal")}
            >
              {isSubmitting ? (
                <span>{t('Transfer.validating')}</span>
              ) : (
                <span>{t('Transfer.confirmTransfer', { amount: formState.amount })}</span>
              )}
            </Button>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {t('Transfer.terms')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
}