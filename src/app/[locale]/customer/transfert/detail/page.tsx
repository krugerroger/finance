// @ts-check
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {  ChevronRightIcon,EnvelopeIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { useUser } from "@/app/[locale]/context/UserContext"
import { useRouter } from "next/navigation"
import ProgressCircle from "@/components/ProgressCircle"
import { toast } from "sonner"
import { useI18n } from "../../../../../../locales/client"
import Link from "next/link"

type TransferMethod = "card" | "bank" | "paypal"
type PaypalOption = "add_paypal" | "select_paypal"

export default function DetailTransfer() {
    const t = useI18n();
    const { user, isLoading } = useUser();
    const router = useRouter();
    const [otp, setOtp] = useState<string>();
    const [percentage, setPercentage] = useState(75);
    
    const pendingTransfer = user?.transfersData?.find(t => t.status === "pending");
    if (!pendingTransfer) {
        return null;
    }
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">...</div>;
    }

    const bankInfo = user?.bank_account?.[0];
    const cardInfo = user?.cards?.[0];
    const paypalInfo = user?.paypalAccount?.[0];
    
    if (pendingTransfer.method === 'bank' && !bankInfo) {
        toast.warning(t('TransferDetail.errors.noBankAccount'));
        router.push("/customer/recipient/add");
    }
    
    if (pendingTransfer.method === 'card' && !cardInfo) {
        toast.warning(t('TransferDetail.errors.noCard'));
        router.push("/customer/recipient/add");
    }

    const handleOtpSubmit = () => {
        if (user?.transfersData?.find(t => t.status === "pending")?.codeOTP === otp) {
            toast.success(t('TransferDetail.toast.success'), {
                description: t('TransferDetail.toast.successDescription'),
                duration: 5000
            });
            setPercentage(90);
        } else {
            toast.error(t('TransferDetail.toast.error'), {
                description: t('TransferDetail.toast.errorDescription'),
                duration: 5000
            });
        }
    };

    return (
        <div className="mx-auto  m py-8">
            <h1 className="text-2xl font-bold mb-6">
                {t('TransferDetail.title', { transferId: pendingTransfer.id?.slice(0, 6)?.toUpperCase() })}
            </h1>
            
            {/* Progress bar */}
            <div className="flex border rounded-lg mb-8 overflow-hidden text-white">
                <span className="inline-block bg-gray-900 text-sm md:text-xl w-1/3 p-4 font-medium">
                    {t('TransferDetail.progress.initialization')}
                </span>
                <span className="inline-block text-sm md:text-xl w-1/3 p-4 bg-indigo-700">
                    {t('TransferDetail.progress.inProgress')}
                </span>
                <span className="inline-block text-sm md:text-xl w-1/3 p-4 bg-gray-900">
                    {t('TransferDetail.progress.completed')}
                </span>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-3">
                        <h1 className="text-2xl text-center font-bold mb-4">
                            {t('TransferDetail.withdrawalTitle')}
                        </h1>
                        
                        <div className="space-y-3 mb-4 border p-3 rounded">
                            {pendingTransfer.method === 'bank' && bankInfo && (
                                <div className="flex flex-col space-y-3 justify-center items-center">
                                    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
                                        <h4>{t('TransferDetail.bankDetails.bankName')}</h4>
                                        <ChevronRightIcon className="w-5" />
                                        <span className="font-bold">{bankInfo.bank_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {t('TransferDetail.bankDetails.iban')}
                                        <ChevronRightIcon className="w-5" />
                                        <span className="font-semibold">
                                            {bankInfo.iban.slice(0, 4)}...{bankInfo.iban.slice(-4)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
                                        {t('TransferDetail.bankDetails.swiftBic')}
                                        <ChevronRightIcon className="w-5" />
                                        <span className="font-semibold">{bankInfo.swift_bic}</span>
                                    </div>
                                </div>
                            )}

                            {pendingTransfer.method === 'card' && cardInfo && (
                                <>
                                    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
                                        <h4>{t('TransferDetail.cardDetails.card')}</h4>
                                        <ChevronRightIcon className="w-5" />
                                        <span className="font-bold">
                                            {cardInfo.card_number.slice(0,4)}**** **** **** {cardInfo.card_number.slice(-4)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {t('TransferDetail.cardDetails.expiration')}
                                        <ChevronRightIcon className="w-5" />
                                        <span className="font-semibold">{cardInfo.date_expiration}</span>
                                    </div>
                                </>
                            )}
                            
                            {pendingTransfer.method === 'paypal' && paypalInfo && (
                                <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded">
                                    <h4>{t('TransferDetail.paypalDetails.email')}</h4>
                                    <ChevronRightIcon className="w-5" />
                                    <span className="font-bold">{paypalInfo.paypal_email}</span>
                                </div>
                            )}
                        </div>
                        
                        <Separator/>
                        
                        <div className=" sm:grid sm:grid-cols-3 gap-4 my-4">
                            <div className="">
                                <h1 className="font-bold text-sm md:text-lg text-gray-700">
                                    {t('TransferDetail.amount.title')}
                                </h1>
                                <span className="block text-2xl font-bold text-indigo-900 my-4">
                                    {user?.monnaie} {pendingTransfer.amount}
                                </span>
                                <p className="text-xs">
                                    {t('TransferDetail.amount.received', { 
                                        amount: (
                                            <span className="text-green-500 font-bold">
                                                {user?.monnaie} {pendingTransfer.amount}
                                            </span>
                                        )
                                    })}
                                </p>
                            </div>
                          
                            <div className="col-span-2">
                                <h1 className="font-bold text-sm md:text-lg text-gray-700">
                                    {t('TransferDetail.otp.title')}
                                </h1>
                                <img
                                    src="/payments.webp"
                                    alt="payment method"
                                    width={200}
                                    height={200}
                                />
                                <p className="my-4 p-2 text-sm md:text-lg">
                                    {t('TransferDetail.otp.instructions', { 
                                        fee: (
                                            <span className="text-yellow-500 font-bold">
                                                {user?.monnaie} {user?.frais}
                                            </span>
                                        )
                                    })}
                                </p>
                                <div>
                                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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
                                    <Button className="bg-yellow-500 my-4"
                                        onClick={handleOtpSubmit}
                                        disabled={otp?.length !== 6}>
                                        {t('TransferDetail.otp.confirmButton')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                            <h1 className="font-bold text-md md:text-lg text-gray-700">
                                {t('TransferDetail.fees.title')}
                            </h1>
                            <div className="flex flex-col sm:flex-row justify-center items-center">
                                <div className="flex flex-col text-gray-700 space-y-2">
                                    <div className="flex items-center gap-5 bg-gray-200 p-5 max-w-xl mx-auto text-gray-700">
                                        <div>Loading</div>
                                        <div>{t('TransferDetail.fees.commission')}</div>
                                        <div className="font-bold text-sm md:text-lg">
                                            {user?.monnaie} {user?.frais}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-sm md:text-lg font-semibold">
                                            {t('TransferDetail.fees.total')}
                                        </div>
                                        <div className="text-sm md:text-lg font-regular">
                                            {user?.monnaie} {user?.frais}
                                        </div>
                                    </div>
                                </div>
                                <ProgressCircle percentage={percentage} />
                            </div>
                        </div>
                        
                        <Separator className="my-4"/>
                        
                        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                            <h1 className="font-bold text-sm md:text-lg text-gray-700">
                                {t('TransferDetail.fees.bankFeesTitle')}
                            </h1>
                            <p className="text-gray-700">
                                {t('TransferDetail.fees.bankFeesDescription', { 
                                    fee: `${user?.frais} ${user?.monnaie}`
                                })}
                            </p>
                            <Link href="https://wa.me/message/KJYLXQUE7UJHM1">
                            <Button className="bg-indigo-800 rounded text-xs md:text-md p-3">
                                <EnvelopeIcon/> {t('TransferDetail.fees.contactButton')}
                            </Button>
                            </Link>
                        </div>  
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}