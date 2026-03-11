import Navbar from "@/components/custom/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import Services from "./components/services";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";
import FAQ from "./components/faq";
import Footer from "./components/footer";

const RootPage = () => {
  return (
    <div>
      <Navbar />
      <div className="relative w-full overflow-hidden">
        {/* Background decorations scoped to hero */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-[5%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[80px]" />
          <div className="absolute top-[10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-500/20 opacity-40 blur-[80px]" />
        </div>
        <main className="container mx-auto px-4 md:px-6">
          <Hero />
        </main>
      </div>

      <About />
      <Services />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default RootPage;