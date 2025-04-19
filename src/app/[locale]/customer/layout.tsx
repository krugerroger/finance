import { SidebarProvider} from "@/components/ui/sidebar"
import CustomerHeader from "@/components/CustomerHeader"
import { UserProvider } from "../context/UserContext"
import { CustomerSidebar } from "@/components/CustomerSidebar"
import CustomerFooter from "@/components/CustomerFooter"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   

  return (
    <div>
      <SidebarProvider>
            <UserProvider>
      <CustomerSidebar />
        <main className="p-2 w-full">
                <CustomerHeader/> 
                {children}
               
      </main>
            </UserProvider>
    </SidebarProvider> <CustomerFooter/>
    </div>
  )
}
