import Link from "next/link"
import { Car } from "lucide-react"

import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8" />
            <span className="font-bold text-xl inline-block">RentHub</span>
          </Link>
          <nav className="hidden gap-6 md:flex">            
            <Link
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How it works
            </Link>
            <Link
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Benefits
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button>
              Sign Up
            </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar