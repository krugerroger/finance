'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminPageTransfert() {
  const supabase = createClientComponentClient()
  const [transfers, setTransfers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Récupérer les transferts
      const { data: transfersData } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false })

      // Récupérer les IDs uniques des utilisateurs
      const userIds = transfersData?.map(t => t.user_id) || []
      
      // Récupérer les profils des utilisateurs concernés
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, nom, prenom')
        .in('user_id', userIds)

      // Créer un map pour accéder facilement aux profils
      const profilesMap: Record<string, any> = {}
      profilesData?.forEach(profile => {
        profilesMap[profile.user_id] = profile
      })

      setTransfers(transfersData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const updateTransferCode = async (id: string, newCode: number) => {
    try {
      const { error } = await supabase
        .from('transfers')
        .update({ codeOTP: newCode })
        .eq('id', id)

      if (error) throw error
      toast.success('Code de transfert mis à jour')
      fetchData()
    } catch (error) {
      console.error('Error updating transfer:', error)
      toast.error('Erreur lors de la mise à jour du code')
    }
  }

  if (loading) return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-r-transparent"></div>
    </div>
  )

  return (
    <div className="p-2 space-y-8">
      <h1 className="text-2xl font-bold">Administration</h1>

      {/* Section Transferts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gestion des Transferts</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transfert</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Code actuel</TableHead>
                <TableHead>Nouveau code</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => {
                return (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id.slice(0,4)}...</TableCell>
                    <TableCell>{transfer.nom}</TableCell>
                    <TableCell>{transfer.amount}</TableCell>
                    <TableCell>{transfer.codeOTP || 'Aucun'}</TableCell>
                    <TableCell>
                      <Input
                        defaultValue={transfer.codeOTP}
                        onChange={(e) => transfer.newCode = e.target.value}
                        placeholder="Nouveau code OTP"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => updateTransferCode(transfer.id, transfer.newCode || transfer.codeOTP || '')}
                        disabled={!transfer.newCode && !transfer.codeOTP}
                      >
                        Mettre à jour
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}