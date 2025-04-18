import { Home, Inbox, List, Plus, Info, Banknote, CreditCard, User} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useI18n } from "../../locales/client"
import Link from "next/link"

interface AppSidebarProps {
  transfertData?: any
}

export function AppSidebar({ transfertData }: AppSidebarProps) {
  const t = useI18n()

  const items = [
    {
      title: t('AppSidebar.items.dashboard'),
      url: "/customer/dashboard",
      icon: Home,
    },
    {
      title: t('AppSidebar.items.addRecipient'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/recipient/add",
      icon: Plus,
    },
    {
      title: t('AppSidebar.items.recipients'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/recipient/list",
      icon: User,
    },
    {
      title: t('AppSidebar.items.transactions'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/transactions",
      icon: List,
    },
    {
      title: t('AppSidebar.items.startTransfer'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/transfert/add",
      icon: Plus,
    },
    {
      title: t('AppSidebar.items.transfers'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/transfert/list",
      icon: List,
    },
    {
      title: t('AppSidebar.items.creditCard'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/cards/add",
      icon: CreditCard,
    },
    {
      title: t('AppSidebar.items.bankStatement'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/rib",
      icon: Info,
    },
    {
      title: t('AppSidebar.items.onlineLoan'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/loans/add",
      icon: Banknote,
    },
    {
      title: t('AppSidebar.items.requestLoan'),
      url: transfertData?.length 
        ? "/customer/transfert/detail" 
        : "/customer/loans/add",
      icon: Plus,
    },
    {
      title: t('AppSidebar.items.profile'),
      url: "/customer/account/show",
      icon: User,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('AppSidebar.menuLabel')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t('AppSidebar.contactLabel')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contact">
                    <Inbox />
                    <span>{t('AppSidebar.items.contact')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}