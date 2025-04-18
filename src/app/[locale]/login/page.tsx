"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useI18n } from "../../../../locales/client"

export default function LoginPage() {
  const t = useI18n()
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      router.push("/customer/dashboard")

    } catch (error: any) {
      console.error("Login error:", error)
      
      if (error.message.includes("Invalid login credentials")) {
        setError(t('LoginPage.errors.invalidCredentials'))
      } else if (error.message.includes("Email not confirmed")) {
        setError(t('LoginPage.errors.emailNotConfirmed'))
      } else {
        setError(t('LoginPage.errors.generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
        <div className=" flex justify-center items-center mb-4">
            <Link href="/"><img src="/logo2.png" alt="Finance Logo" className="h-10" /></Link>
        </div>
          <p className="text-gray-600 mb-6">
            {t('LoginPage.subtitle')}
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card className="w-full mx-auto max-w-md shadow-lg rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('LoginPage.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('LoginPage.form.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('LoginPage.form.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('LoginPage.form.passwordLabel')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('LoginPage.form.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('LoginPage.form.loadingText')}
                    </>
                  ) : (
                    t('LoginPage.form.submitButton')
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link 
                href="/forgot-password" 
                className="text-blue-600 hover:underline"
              >
                {t('LoginPage.form.forgotPassword')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-600">
            {t('LoginPage.form.noAccount')}{" "}
            <Link href="/register/" className="text-blue-600 font-semibold hover:underline">
              {t('LoginPage.form.registerLink')}
            </Link>
          </p>
        </div>

        <div className="max-w-md mx-auto text-xs text-gray-500 bg-white p-4 rounded-lg">
          <p>{t('LoginPage.securityNotice')}</p>
        </div>
      </div>
    </div>
  )
}