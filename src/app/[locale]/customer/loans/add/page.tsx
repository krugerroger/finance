//@ts-check
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "../../../../../../locales/client"

export default function AddLoans() {
  const t = useI18n()

  return (
    <div className="">
      <div>
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">{t('AddLoansPage.title')}</h1>  
        </div>
        <div className="">
          <Card>
            <CardContent className="">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="text-center">
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.loanAmount')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.zeroAmount')}</div>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.interestRate')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.interestRate')}</div>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.duration')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.zeroDuration')}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.monthlyPayments')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.zeroAmount')}</div>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.totalPayments')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.zeroAmount')}</div>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-3 border py-4 font-semibold">
                      {t('AddLoansPage.summary.totalInterest')}
                    </div>
                    <div className="border py-4">{t('AddLoansPage.values.zeroAmount')}</div>
                  </div>
                </div>
              </div>
              <Separator/>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label>{t('AddLoansPage.form.loanAmount')}</Label>
                  <Input 
                    type="number" 
                    placeholder={t('AddLoansPage.placeholders.amount')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('AddLoansPage.form.loanDuration')}</Label>
                  <Input 
                    type="number" 
                    placeholder={t('AddLoansPage.placeholders.duration')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('AddLoansPage.form.loanPurpose')}</Label>
                  <textarea 
                    name="loans_object" 
                    rows={5} 
                    className="border rounded-md w-full" 
                    placeholder={t('AddLoansPage.placeholders.purpose')}
                  ></textarea>
                </div>
                <Button className="p-3 bg-green-700" disabled>
                  {t('AddLoansPage.form.requestButton')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}