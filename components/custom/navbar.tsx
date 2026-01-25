import { Car } from "lucide-react"
import Link from "next/link"


const Navbar = () => {
  return (
    <nav className="flex items-center w-full font-bold text-2xl px-12 py-4 bg-amber-50">
        <div className="flex items-center gap-2">
            <Car className="size-8"/>
            <Link href="/">RentHub</Link>
        </div>
    </nav>
  )
}

export default Navbar