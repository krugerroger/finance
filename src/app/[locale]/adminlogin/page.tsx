'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    setError(null)

    // 1. Vérification de l'email admin avant l'authentification
    if (email !== 'admin10@admin10.com') {
      setError('Accès réservé à l\'administrateur')
      return
    }

    try {
      // 2. Authentification avec Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      // 4. Redirection si tout est valide
      router.push("/admin/manageusers")

    } catch (error: unknown) {
      console.error("Erreur de connexion:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
      } else {
        setError("Erreur inconnue");
      }
    }
  }

  return (
    <div className="h-screen p-4 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="admin@gmail.com"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Connexion Admin
          </button>
        </div>
      </div>
    </div>
  )
}