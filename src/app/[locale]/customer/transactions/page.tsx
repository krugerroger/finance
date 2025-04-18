// @ts-check
"use client"

import React from "react"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useUser } from "../../context/UserContext"
import { useI18n } from "../../../../../locales/client"

export default function Transactions() {
  const { user } = useUser()
  const t = useI18n()

  return (
    <div className="">
      <div>
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">{t("Transactions.title")}</h1>
          <Link
            href="/customer/recipient/add"
            className="block flex gap-1 items-center text-sm text-green-700 font-semibold hover:text-green-900"
          >
            <Plus className="w-5" />
            {t("Transactions.addRecipient")}
          </Link>
        </div>
        <div>
          <Table>
            <TableCaption>{t("Transactions.caption")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("Transactions.label")}</TableHead>
                <TableHead>{t("Transactions.type")}</TableHead>
                <TableHead className="text-right">{t("Transactions.time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{user?.numero_compte}</TableCell>
                <TableCell>{t("Transactions.accountOpening")}</TableCell>
                <TableCell>{t("Transactions.credit")}</TableCell>
                <TableCell className="text-right">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
