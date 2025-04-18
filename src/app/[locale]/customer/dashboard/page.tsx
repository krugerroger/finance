//@ts-check
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from "../../context/UserContext"
import { useRouter } from "next/navigation"
import { useI18n } from "../../../../../locales/client"

export default function Dashboard() {
    const { user, supabase, isLoading } = useUser()
    const [error] = useState<string | null>(null)
    const router = useRouter()
    const t = useI18n()

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login')
            }
        })
      
        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [router, supabase.auth])
    
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">...</div>
    }

    return (
        <div className="">
            <div className="">
                <div className="">
                    <div className="mb-5">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold">{t('DashboardPage.title')}</h1>  
                        </div>
                        {user?.transfersData?.map((transfer) => {
                            const bankInfo = user?.bank_account?.[0]
                            return (
                                <div key={transfer.id} className="mb-4 border mx-auto rounded">
                                    {transfer.method === 'bank' && bankInfo && (
                                        <div className="flex justify-around items-center">
                                            <div className="flex text-sm flex-col items-center space-x-4 border p-2 w-1/3">
                                                {t('DashboardPage.bankInfo.bankName')}
                                                <span className="font-bold text-xs">{bankInfo.bank_name}</span>
                                            </div>
                                            <div className="text-sm flex flex-col items-center border p-2 space-x-4 w-1/3">
                                                {t('DashboardPage.bankInfo.iban')}
                                                <span className="text-xs font-semibold">
                                                    {bankInfo.iban.slice(0, 4)}...{bankInfo.iban.slice(-4)}
                                                </span>
                                            </div>
                                            <div className="text-sm flex flex-col items-center space-x-4 border p-2 w-1/3">
                                                {t('DashboardPage.bankInfo.swiftBic')}
                                                <span className="text-xs font-semibold">{bankInfo.swift_bic}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {renderCard(
                                user?.transfersData?.find(t => t.status === "pending")?.status === "pending" 
                                    ? "/customer/transfert/detail" 
                                    : "/customer/transaction",
                                t('DashboardPage.cards.transactions.title'),
                                t('DashboardPage.cards.transactions.description'),
                                t('DashboardPage.cards.transactions.count')
                            )}
                            {renderCard(
                                user?.transfersData?.find(t => t.status === "pending")?.status === "pending" 
                                    ? "/customer/transfert/detail" 
                                    : "/customer/transfert/list",
                                t('DashboardPage.cards.pendingTransfers.title'),
                                t('DashboardPage.cards.pendingTransfers.description'),
                                user?.transfersData?.length
                            )}
                            {renderCard(
                                user?.transfersData?.find(t => t.status === "pending")?.status === "pending" 
                                    ? "/customer/transfert/detail" 
                                    : "/customer/transfert/list",
                                t('DashboardPage.cards.transfers.title'),
                                t('DashboardPage.cards.transfers.description'),
                                user?.transfersData?.length?.toString()
                            )}
                            {renderCard(
                                user?.transfersData?.find(t => t.status === "pending")?.status === "pending" 
                                    ? "/customer/transfert/detail" 
                                    : "/customer/loans/list",
                                t('DashboardPage.cards.loans.title'),
                                t('DashboardPage.cards.loans.description'),
                                t('DashboardPage.cards.loans.count')
                            )}
                            {renderCard(
                                user?.transfersData?.find(t => t.status === "pending")?.status === "pending" 
                                    ? "/customer/transfert/detail" 
                                    : "/customer/recipient/list",
                                t('DashboardPage.cards.beneficiaries.title'),
                                t('DashboardPage.cards.beneficiaries.description'),
                                user?.bank_account?.length?.toString()
                            )}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('DashboardPage.cards.creditCards.title')}</CardTitle>
                                    <CardDescription>{t('DashboardPage.cards.creditCards.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{user?.cards?.length}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <h1 className="text-xl font-bold">{t('DashboardPage.transactions.title')}</h1>  
                        </div>
                        <div>
                            <Table>
                                <TableCaption>{t('DashboardPage.transactions.table.caption')}</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                    {t('DashboardPage.transactions.table.headers')
                                      .split('|')
                                      .map((header, index) => (
                                        <TableHead key={index}>{header}</TableHead>
                                    ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">{user?.numero_compte}</TableCell>
                                        <TableCell>{t('DashboardPage.transactions.table.accountOpening')}</TableCell>
                                        <TableCell>{t('DashboardPage.transactions.table.credit')}</TableCell>
                                        <TableCell className="text-right">
                                            {user?.created_at ? 
                                                new Date(user.created_at).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) 
                                                : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex mx-auto mt-5 w-1/2 justify-center">
                                <Button>
                                    <Link href="/customer/transactions">
                                        {t('DashboardPage.transactions.table.viewAll')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function renderCard(href: string, title: string, description: string, count: any) {
        return (
            <Card>
                <Link href={href}>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{count}</p>
                    </CardContent>
                </Link>
            </Card>
        )
    }
}