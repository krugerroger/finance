//@ts-check
"use client"

import React from "react"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CircleCheck, Info, Plus, User } from "lucide-react"
import { useI18n } from "../../../../../../locales/client"


export default function RecipientList() {
  const t = useI18n();

  return (
    <div className="">
      <div>
        <div className="mb-4 flex justify-between">
          <h1 className="md:text-xl font-bold">{t('RecipientListPage.title')}</h1>  
          <Link 
            href="/customer/recipient/add" 
            className="block flex gap-1 items-center text-sm text-green-700 font-semibold hover:text-green-900"
          >
            <Plus className="w-5"/>
            {t('RecipientListPage.addButton')}
          </Link>
        </div>
        <div>
          <Table>
            <TableCaption>{t('RecipientListPage.table.caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <CircleCheck/>
                  <span className="sr-only">{t('RecipientListPage.table.headers.check')}</span>
                </TableHead>
                <TableHead>
                  <Info/>
                  <span className="sr-only">{t('RecipientListPage.table.headers.info')}</span>
                </TableHead>
                <TableHead>
                  <User/>
                  <span className="sr-only">{t('RecipientListPage.table.headers.recipient')}</span>
                </TableHead>
                <TableHead className="text-right">
                  <Calendar/>
                  <span className="sr-only">{t('RecipientListPage.table.headers.date')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium"></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex mx-auto mt-5 w-1/2 justify-center">
          </div>
        </div>
      </div>
    </div>
  )
}