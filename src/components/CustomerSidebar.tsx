// components/CustomerSidebar.tsx
'use client'

import { useUser } from "@/app/[locale]/context/UserContext"
import { AppSidebar } from "@/components/app-sidebar"

export function CustomerSidebar() {
  const { user } = useUser()
  return <AppSidebar transfertData={user?.transfersData} />
}