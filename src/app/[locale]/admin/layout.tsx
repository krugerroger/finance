import Adminheader from "@/components/Adminheader";


export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   

  return (
            <main className="p-1 w-full">
                <Adminheader/>
                {children}
      </main>
  )
}
