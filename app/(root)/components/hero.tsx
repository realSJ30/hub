"use client"
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Sparkle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Hero = () => {
  const router = useRouter()
  
  return (
    <section className='relative w-full py-12 md:py-24 lg:py-32 xl:py-48'>      
      
      <div className='container px-4 md:px-6 relative z-10'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center'>
          <div className='flex flex-col justify-center space-y-8 text-left'>  
            <div className='inline-flex w-fit items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm'>
              <Sparkle className="mr-2 h-3 w-3 text-primary" />
              <span>Simplify your rental business</span>
            </div>                      
            <div className='space-y-4'>
              <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl/none max-w-[800px]'>
                Maximize Your <br />
                <span className='bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent'>
                  Productivity
                </span>
              </h1>
              <p className='max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed'>
                 Streamline your rental business with RentHub. The all-in-one platform designed for modern property managers and landlords to save time and increase revenue.
              </p>
            </div>
            
            <div className='flex flex-col gap-3 min-[400px]:flex-row pt-4'>
              <Button onClick={() => router.push('/signup')} size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
             <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2 transition-colors hover:text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2 transition-colors hover:text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                </div>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className='flex items-center justify-center lg:justify-end mt-12 lg:mt-0 relative'>
            <div className='relative w-full max-w-[600px] aspect-square lg:aspect-4/3'>
              {/* Back Image (Dash 2) */}
              <div className="absolute top-0 right-0 w-[85%] rounded-2xl border border-border/50 shadow-2xl bg-background overflow-hidden z-10 transition-all hover:-translate-y-3 hover:translate-x-3 hover:rotate-1 duration-500 ring-1 ring-border/20 flex flex-col">
                {/* Browser Header */}
                <div className="h-8 border-b border-border/50 bg-muted/30 px-3 flex items-center gap-1.5 shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <Image
                  src="/assets/hero-dash-2.png"
                  alt="RentHub Dashboard Overview"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover border-b-4 sm:border-b-8 border-x-4 sm:border-x-8 border-background rounded-b-xl"
                />
              </div>

              {/* Front Image (Dash 1) */}
              <div className="absolute bottom-0 left-0 w-[85%] rounded-2xl border border-border/50 shadow-2xl bg-background overflow-hidden z-20 transition-all hover:-translate-y-3 hover:-translate-x-3 hover:-rotate-1 duration-500 ring-1 ring-border/20 flex flex-col">
                {/* Browser Header */}
                <div className="h-8 border-b border-border/50 bg-muted/30 px-3 flex items-center gap-1.5 shrink-0 backdrop-blur-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <Image
                  src="/assets/hero-dash-1.png"
                  alt="RentHub Fleet Management"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover border-b-4 sm:border-b-8 border-x-4 sm:border-x-8 border-background rounded-b-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero