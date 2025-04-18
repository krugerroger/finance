
'use client'
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminHeader() {

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
        <Button onClick={signout}>Déconnexion</Button>
      </div>

      <div className="flex flex-col gap-4 p-6 text-center">
        <div className="flex flex-col gap-3 mb-6 sm:flex-row">
          <Link href="/admin/manageusers" className="flex-1 flex items-center gap-2 h-14">
            <Button variant="default" className="h-14 w-full">
              Approuver inscriptions
            </Button>
          </Link>
          <Link href="/admin/manageaccount" className="flex-1 flex items-center gap-2 h-14">
            <Button variant="default" className="h-14 w-full">
              Gérer les soldes
            </Button>
          </Link>
          <Link href="/admin/managetransfert" className="flex-1 flex items-center gap-2 h-14">
            <Button variant='default' className="h-14 w-full">
              Code de transfert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
