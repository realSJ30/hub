import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignUpForm = () => {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="[EMAIL_ADDRESS]" />
        </div>
        <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button>Sign Up</Button>
    </div>
  )
}

export default SignUpForm