'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Account {
  id: string
  user_id: string
  numero_compte: string
  name: string // Nouvelle colonne ajoutée
  solde: number
  frais: number
  monnaie: string
  created_at?: string
  newBalance?: string
  newFrais?: string
}

export default function AdminPage() {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Récupération directe depuis la table accounts avec le nom inclus
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          id,
          user_id,
          numero_compte,
          name,
          solde,
          frais,
          monnaie,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setAccounts(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const updateAccount = async (id: string, newBalance: number, newFrais: number) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ 
          solde: newBalance,
          frais: newFrais,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      toast.success('Compte mis à jour avec succès')
      await fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  )

  return (
    <div className="p-2 space-y-8">
      <h1 className="text-2xl font-bold">Gestion des comptes</h1>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Numéro de compte</TableHead>
              <TableHead>Solde actuel</TableHead>
              <TableHead>Nouveau solde</TableHead>
              <TableHead>Frais (%)</TableHead>
              <TableHead>Nouveaux frais (%)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.name || `Client ${account.user_id.slice(0, 6)}`}
                </TableCell>
                <TableCell>{account.numero_compte}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: account.monnaie || 'EUR'
                  }).format(account.solde)}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={account.solde}
                    onChange={e => account.newBalance = e.target.value}
                    step="0.01"
                    min="0"
                  />
                </TableCell>
                <TableCell>{account.frais}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={account.frais}
                    onChange={e => account.newFrais = e.target.value}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => updateAccount(
                      account.id,
                      parseFloat(account.newBalance || account.solde.toString()),
                      parseFloat(account.newFrais || account.frais.toString())
                    )}
                  >
                    Mettre à jour
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}