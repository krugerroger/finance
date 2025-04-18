//@ts-check
"use client"

import React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CircleCheck, Info } from "lucide-react"
import { useI18n } from "../../../../../../locales/client"

export default function ListTransfert() {
  const t = useI18n()

  return (
    <>
      <div className="">
        <div>
          <div className="mb-4 flex justify-between">
            <h1 className="text-xl font-bold">{t('TransferHistory.title')}</h1>  
          </div>
          <div>
            <Table>
              <TableCaption>{t('TransferHistory.tableCaption')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <span className="sr-only">{t('TransferHistory.headers.status')}</span>
                    <CircleCheck/>
                  </TableHead>
                  <TableHead>{t('TransferHistory.headers.amount')}</TableHead>
                  <TableHead>
                    <span className="sr-only">{t('TransferHistory.headers.details')}</span>
                    <Info/>
                  </TableHead>
                  <TableHead>{t('TransferHistory.headers.recipient')}</TableHead>
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
              {/* Pagination or other content */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}