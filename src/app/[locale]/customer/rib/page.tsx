// @ts-check
"use client"

import React from "react"
import { useI18n } from "../../../../../locales/client"


export default function Rib() {
  const t = useI18n()

  return (
    <div className="">
      <div>
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">{t("Rib.title")}</h1>
        </div>
        <div className="space-y-4">
          <p className="text-red-700">
            {t("Rib.notice1")}
          </p>
          <div className="grid grid-cols-5 text-sm">
            <div className="border py-4">{t("Rib.table.bankName")}</div>
            <div className="border py-4">{t("Rib.table.accountNumber")}</div>
            <div className="border py-4">{t("Rib.table.ribKey")}</div>
            <div className="border py-4">{t("Rib.table.iban")}</div>
            <div className="border py-4">{t("Rib.table.swiftCode")}</div>
          </div>
          <p className="text-gray-500">
            {t("Rib.notice2")}
          </p>
          <p className="text-gray-500">
            {t("Rib.notice3")}
          </p>
          <p className="text-gray-500">
            {t("Rib.notice4")}
          </p>
          <p>
            {t("Rib.notice5")}
          </p>
          <p className="text-gray-500">
            {t("Rib.notice6")}
          </p>
          <p className="text-gray-500">
            {t("Rib.notice7")}
          </p>
        </div>
      </div>
    </div>
  )
}
