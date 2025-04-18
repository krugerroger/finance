// @ts-check
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {  ChevronRightIcon,EnvelopeIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Image from "next/image"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { useUser } from "@/app/[locale]/context/UserContext"
import { useRouter } from "next/navigation"
import ProgressCircle from "@/components/ProgressCircle"
import { toast } from "sonner"

type TransferMethod = "card" | "bank" | "paypal"
type PaypalOption = "add_paypal" | "select_paypal"

export default function DetailTransfer() {
    const [selectedMethod, setSelectedMethod] = useState<TransferMethod>("card")
    const [paypalOption, setPaypalOption] = useState<PaypalOption>("add_paypal")
    const [otp, setOtp] = useState<string>();
    const router = useRouter();
    const { user,isLoading } = useUser();
   const pendingTransfer = user?.transfersData?.find(t => t.status === "pending");
    if (!pendingTransfer) {
        return null;
    }
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">...</div>;
    }

 
    
    const bankInfo = user?.bank_account?.[0];
    const cardInfo = user?.cards?.[0];
    
    if (pendingTransfer.method === 'bank' && !bankInfo) {
        toast.warning("Veuillez ajouter un compte bancaire.")
        router.push("/customer/recipient/add")
    }
    
    if (pendingTransfer.method === 'card' && !cardInfo) {
        toast.warning("Veuillez ajouter une carte de crédit.")
        router.push("/customer/recipient/add")
    }

    const handleOtpSubmit = () => {
        console.log("Code OTP saisi:", otp);
        console.log()
        // Ajoutez ici votre logique de validation
        if( user?.transfersData?.find(t => t.status === "pending")?.codeOTP === otp){
            toast.success("Succès", {
                description: "Code OTP validé avec succès",
                duration: 5000
              })
        }else{
            toast.error("Erreur", {
                description: "Code incorrect",
                duration: 5000
              })
        }
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                Virement bancaire n° {user?.transfersData?.find(t => t.status === "pending")?.id?.slice(0, 6)?.toUpperCase()}
            </h1>
            
            {/* Progress bar */}
            <div className="flex border rounded-lg mb-8 overflow-hidden text-white">
                <span className="inline-block bg-gray-900  text-xl w-1/3 p-4 font-medium">
                    Initialisation
                </span>
                <span className="inline-block text-xl w-1/3 p-4  bg-indigo-700">
                    Traitement en cours
                </span>
                <span className="inline-block text-xl w-1/3 p-4 bg-gray-900">
                    Transfert terminé
                </span>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                
                <Card>
                    <CardContent className="p-6">
                        <h1 className="text-2xl text-center font-bold mb-4">Retrait de fonds destiné à:</h1>
                        {/* Method selection buttons */}
                        <div className="text-center space-y-1 mb-5">
                        {user?.transfersData?.map((transfer) => {
  const bankInfo = user?.bank_account?.[0]; // suppose qu'il n'y a qu'un seul compte
  const cardInfo = user?.cards?.[0]; // suppose qu'il n'y a qu'une seule carte
  const paypalInfo = user?.paypalAccount?.[0]; // suppose qu'il n'y a qu'une seule carte

  return (
    <div key={transfer.id} className="space-y-3 mb-4 border p-3 rounded">
      {transfer.method === 'bank' && bankInfo && (
        <div className="flex flex-col space-y-3 justify-center items-center">
          <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
            <h4 className=" text-center">Nom de la banque</h4>
            <ChevronRightIcon className="w-5" />
            <span className="font-bold">{bankInfo.bank_name}</span>
          </div>
          <div className="flex items-center space-x-4">
            IBAN
            <ChevronRightIcon className="w-5" />
            <span className="font-semibold">
            {bankInfo.iban.slice(0, 4)}...{bankInfo.iban.slice(-4)}
            </span>

          </div>
          <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
            Code Swift/BIC
            <ChevronRightIcon className="w-5" />
            <span className="font-semibold">{bankInfo.swift_bic}</span>
          </div>
        </div>
      )}

      {transfer.method === 'card' && cardInfo && (
        <>
          <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
            <h4>Carte</h4>
            <ChevronRightIcon className="w-5" />
            <span className="font-bold">{cardInfo.card_number.slice(0,4)}**** **** **** {cardInfo.card_number.slice(-4)}</span>
          </div>
          <div className="flex items-center space-x-4">
            Expiration
            <ChevronRightIcon className="w-5" />
            <span className="font-semibold">{cardInfo.date_expiration}</span>
          </div>
        </>
      )}
      {transfer.method ==='paypal' && paypalInfo &&(
         <>
         <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
           <h4>Adresse PayPal</h4>
           <ChevronRightIcon className="w-5" />
           <span className="font-bold">{paypalInfo.paypal_email}</span>
         </div>
       </>
      )}
    </div>
  );
})}
                        </div>
                        <Separator/>
                        <div className="grid grid-cols-3 gap-4 my-4">
                            <div className="">
                                <h1 className="font-bold text-lg text-gray-700">Montant du transfert</h1>
                                <span className="block text-2xl font-bold text-indigo-900 my-4">{user?.monnaie} {user?.transfersData?.find(t => t.status === "pending")?.amount}
                                </span>
                                <p className="text-xs">Vous allez reçevoir l'équivalent de <span className="font-semibold text-indigo-900">{user?.monnaie} {user?.transfersData?.find(t => t.status === "pending")?.amount}
                                    </span> sur votre compte au terme de cette transaction.

                                </p>
                            </div>
                          
                            <div className="col-span-2">
                                <h1 className="font-bold text-lg text-gray-700">Saisir le code du transfert</h1>
                                <Image
                                    src="/payments.png"
                                    alt="payment method"
                                    width={200}
                                    height={200}
                                    />
                            <p className="my-4 p-2 text-lg">- Afin de confirmer le paiement de 
                                <span className="font-bold text-yellow-500"> {user?.monnaie} {user?.frais}</span> liés à cette transaction, nous vous prions de saisir le code que vous avez obtenu auprès de votre gestionnaire de compte. Ce code vous a été fourni pour des raisons de sécurité afin de valider votre demande de retrait de fonds et de s'assurer que vous êtes le titulaire autorisé du compte.

                            </p>
                            <div>
                                <InputOTP  maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button  className="bg-yellow-500 my-4"
                                    onClick={handleOtpSubmit}
                                    disabled={otp?.length !== 6} >Confirmation</Button>
                            </div>
                            </div>
                        </div>
                        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                            <h1 className="font-bold text-lg text-gray-700">Frais de transaction</h1>
                            <div className="flex justify- items-center">
                                <div className="flex flex-col text-gray-700 space-y-2">
                                   <div className="flex items-center gap-5 bg-gray-200 p-5 max-w-xl mx-auto text-gray-700">
                                        <div>Loading</div>
                                        <div>FRAIS DE COMMISSION BANCAIRE</div>
                                        <div className="font-bold text-lg ">{user?.monnaie} {user?.frais}</div>
                                   </div>
                                   <div className="flex justify-between">
                                        <div className="text-lg font-semibold">Total</div>
                                        <div className="text-lg font-regular">{user?.monnaie} {user?.frais}</div>
                                   </div>
                                </div>
                                <ProgressCircle />
                            </div>
                        </div>
                        <Separator className="my-4"/>
                        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                            <h1 className="font-bold text-lg text-gray-700">Frais de commission bancaire</h1>
                            <p className="text-gray-700">FRAIS DE COMMISSION BANCAIRE A PAYER {user?.frais} {user?.monnaie} </p>
                            <Button className="bg-indigo-800 rounded text-md p-6"><EnvelopeIcon/> Contacter mon gestionnaire de compte</Button>
                        </div>  
                       
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}