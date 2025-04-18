// ... (imports existants)
'use client'
import { Button } from "@/components/ui/button"
import { TableHeader, TableRow, TableHead, TableBody, TableCell,Table } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  created_at: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  // Ajoutez d'autres champs nécessaires
}

export default function AdminPage() {
    // ... (states existants)
    const [pendingUsers, setPendingUsers] = useState<User[]>([])
  
    useEffect(() => {
      fetchPendingUsers()
      // ... (autres fetch)
    }, [])
  
    const fetchPendingUsers = async () => {
      const { data } = await supabase
        .from('pending_users')
        .select('*')
        .eq('status', 'pending')
      
      setPendingUsers(data || [])
    }
  
    const approveUser = async (userId: string) => {
      try {
        // 1. Récupérer les données du pending user
        const { data: userData } = await supabase
          .from('pending_users')
          .select('*')
          .eq('id', userId)
          .single()
  
        if (!userData) throw new Error('User not found')
  
        // 2. Créer le compte auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.prenom,
              last_name: userData.nom,
              phone: userData.telephone
            }
          }
        })
  
        if (authError) throw authError
  
        // 3. Créer le profil dans la table profiles
              // 2. Enregistrement des données supplémentaires dans la table 'profiles'
      const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user?.id,
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
        telephone: userData.telephone,
        sexe: userData.sexe,
        date_naissance: userData.date_naissance,
        pays: userData.pays,
        ville: userData.ville,
        adresse: userData.adresse,
        })

    if (profileError) {
      throw profileError
    }
  
        // 4. Créer le compte dans accounts
        const { error: accountError } = await supabase
          .from('accounts')
          .insert({
            user_id: authData.user?.id,
            nom: userData.nom && ' '&& userData.prenom,
            type_compte: userData.type_compte,
            monnaie: userData.monnaie,
            langue: userData.langue,
            numero_compte: userData.numero_compte || generateAccountNumber(), // Générer un numéro de compte si non fourni
            solde: userData.solde || 0,
          })
  
        if (accountError) throw accountError
  
        // 5. Mettre à jour le statut
        await supabase
          .from('pending_users')
          .update({ status: 'approved' })
          .eq('id', userId)
  
        toast.success('Utilisateur approuvé avec succès')
        fetchPendingUsers()
      } catch (error) {
        toast.error("Erreur lors de l'approbation")
        console.error(error)
      }
    }
  
    const rejectUser = async (userId: string) => {
      const { error } = await supabase
        .from('pending_users')
        .update({ status: 'rejected' })
        .eq('id', userId)
  
      if (error instanceof Error) {
        toast.error("Erreur lors du rejet")
      } else {
        toast.success('Utilisateur rejeté')
        fetchPendingUsers()
      }
    }
  
    return (
      <div className="p-8 space-y-8">
        {/* ... Sections existantes ... */}
  
        {/* Nouvelle section pour les validations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Demandes d'inscription</h2>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mot de passe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.prenom} {user.nom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => rejectUser(user.id)}
                      >
                        Rejeter
                      </Button>
                      <Button
                        onClick={() => approveUser(user.id)}
                      >
                        Approuver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    )
  }
  
  function generateAccountNumber() {
    return 'FR' + Math.random().toString().slice(2, 12)
  }