import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="bg-white text-gray-800">
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
