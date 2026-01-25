import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const Hero = () => {
  return (
    <section className='relative w-full py-12 md:py-24 lg:py-32 xl:py-48'>      
      
      <div className='container px-4 md:px-6 relative z-10'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center'>
          <div className='flex flex-col justify-center space-y-8 text-left'>                        
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
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-8 text-base">
                View Demo
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
          <div className='flex items-center justify-center lg:justify-end mt-12 lg:mt-0'>
            <div className='relative w-full max-w-[550px] aspect-square lg:aspect-4/3 rounded-2xl bg-background/40 p-4 shadow-2xl ring-1 ring-border/50 backdrop-blur-xl'>
                <div className="h-full w-full rounded-xl bg-card border shadow-sm relative overflow-hidden flex flex-col">
                    {/* Mock Browser Header */}
                    <div className="h-10 border-b bg-muted/30 px-4 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                        <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                        <div className="ml-4 h-5 w-48 rounded bg-muted/50"></div>
                    </div>
                    {/* Mock Content */}
                    <div className="flex-1 p-6 relative">
                        <div className="flex gap-6 h-full">
                            {/* Sidebar Mock */}
                            <div className="hidden sm:flex w-16 h-full flex-col gap-4 border-r pr-4">
                                <div className="h-8 w-full bg-primary/10 rounded-md"></div>
                                <div className="h-8 w-full bg-muted/30 rounded-md"></div>
                                <div className="h-8 w-full bg-muted/30 rounded-md"></div>
                            </div>
                            {/* Main Content Mock */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-8 w-32 bg-muted/50 rounded-md"></div>
                                    <div className="h-8 w-8 bg-muted/50 rounded-full"></div>
                                </div>
                                <div className="h-32 w-full bg-linear-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/10 p-4 flex items-end">
                                    <div className="h-16 w-12 bg-primary/20 rounded-md mr-2"></div>
                                    <div className="h-24 w-12 bg-primary/30 rounded-md mr-2"></div>
                                    <div className="h-20 w-12 bg-primary/25 rounded-md"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-muted/30 rounded"></div>
                                    <div className="h-4 w-5/6 bg-muted/30 rounded"></div>
                                    <div className="h-4 w-4/6 bg-muted/30 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero