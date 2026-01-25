import Navbar from "@/components/custom/navbar"
import Hero from "./components/hero"

const RootPage = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 md:px-6">
        <Hero />
      </main>
    </div>
  )
}

export default RootPage