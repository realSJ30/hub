import Navbar from "@/components/custom/navbar"
import Hero from "./components/hero"

const RootPage = () => {
  return (
    <div>
      <Navbar />
      <div className="relative w-full overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 hover:bg-primary/30 opacity-40 blur-[80px] transition-all duration-1000"></div>
          <div className="absolute bottom-[20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-500/20 opacity-40 blur-[80px]"></div>
        </div>
        <main className="container mx-auto px-4 md:px-6">
          <Hero />
        </main>
      </div>
    </div>
  )
}

export default RootPage