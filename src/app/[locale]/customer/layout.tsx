import { SidebarProvider} from "@/components/ui/sidebar"
import CustomerHeader from "@/components/CustomerHeader"
import { UserProvider } from "../context/UserContext"
import { CustomerSidebar } from "@/components/CustomerSidebar"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   

  return (
    <SidebarProvider>
            <UserProvider>
      <CustomerSidebar />
        <main className="p-6 w-full">
                <CustomerHeader/> 
                {children}
      </main>
            </UserProvider>
    </SidebarProvider>
  )
}
