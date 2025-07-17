import Features from "@/components/ui/features";
import Footer from "@/components/ui/layout/footer";
import Hero from "@/components/ui/hero";
import Navbar from "@/components/ui/layout/navbar";

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
