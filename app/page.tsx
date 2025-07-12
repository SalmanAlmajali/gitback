import Features from "@/components/ui/features";
import Footer from "@/components/ui/footer";
import Hero from "@/components/ui/hero";
import Navbar from "@/components/ui/navbar";

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
