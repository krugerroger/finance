import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Features from '@/components/Features'
import Footer from '@/components/Footer'


export const metadata = {
  title: 'Assurance emprunteur | Banque Paribas',
  description: 'Gerez facilement vos comptes bancaires et vos finances en ligne.',
}

export default function Home() {
  return (
    <main>
      <Header/>
      <HeroSection/>
      <Features/>
      <Footer/>
    </main>
  )
}
