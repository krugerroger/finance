'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'

type Bank_account = {
  id: string
  account_holder_name: string
  beneficiary_address: string
  swift_bic: string
  iban: string
  country: string
  account_number: string
  currency_code: string
  bank_name: string
  bank_address: string
  account_type: string
}
type Cards = {
  id?: string
  card_number: string
  date_expiration: string
  cvv: string
  cardholder_name: string
}
type TransfersData = {
  id?: string
  status: string
  amount: number
  method: string
  selected_account: string
  codeOTP: string
}
type PaypalAccount = {
  id?: string
  paypal_email: string
}

type UserProfile = {
  // Données de base
  user_id: string
  email?: string
  nom?: string
  prenom?: string
  telephone?: string
  sexe?: string
  date_naissance?: string
  pays?: string
  ville?: string
  adresse?: string
  
  // Données du compte
  type_compte?: string
  monnaie?: string
  langue?: string
  numero_compte?: string
  solde?: number
  created_at: Date
  frais: number

  // Bénéficiaires - maintenant un tableau d'objets structurés
  bank_account?: Bank_account[]
  paypalAccount?: PaypalAccount[]
  cards?: Cards[]
  transfersData?: TransfersData[]
}

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  supabase: SupabaseClient
  refreshUser: () => Promise<void> // Ajout d'une fonction de rafraîchissement
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  supabase: createClientComponentClient(),
  refreshUser: async () => {}
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) throw error || new Error('No user session')

      // Requêtes en parallèle pour meilleure performance
      const [profileRes, accountRes, paypalAccountsRes, userCardsRes, transferDataRes, bank_accountRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', authUser.id).single(),
        supabase.from('accounts').select('*').eq('user_id', authUser.id).single(),
        supabase.from('paypal_accounts').select('*').eq('user_id', authUser.id),
        supabase.from('user_cards').select('*').eq('user_id', authUser.id),
        supabase.from('transfers').select('*').eq('user_id', authUser.id),
        supabase.from('bank_accounts').select('*').eq('user_id', authUser.id),
      ])

      if (profileRes.error || accountRes.error || paypalAccountsRes.error || userCardsRes.error || transferDataRes.error || bank_accountRes.error) {
        throw profileRes.error || accountRes.error || paypalAccountsRes.error || userCardsRes.error || transferDataRes.error || bank_accountRes.error
      }

      // Construction de l'objet utilisateur
      const combinedUser: UserProfile = {
        ...profileRes.data,
        ...accountRes.data,
        bank_account: bank_accountRes.data || [],
        paypalAccount: paypalAccountsRes.data || [],
        cards: userCardsRes.data || [],
        transfersData: transferDataRes.data || [],
        user_id: authUser.id,
        email: authUser.email
      }

      setUser(combinedUser)

    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/login')
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUserData()
      }
    })

    return () => subscription?.unsubscribe()
  }, [router, supabase])

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      supabase,
      refreshUser: fetchUserData // Exposition de la fonction de rafraîchissement
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)