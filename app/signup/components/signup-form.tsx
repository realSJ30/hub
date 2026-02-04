import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import Link from "next/link";
import GoogleIcon from "@/components/icons/google.icon";
import GithubIcon from "@/components/icons/github.icon";

const SignUpForm = () => {
  return (
    <div className="flex py-4 gap-3 justify-between px-12 mx-auto w-full h-screen">
      <div className="flex flex-col gap-4 flex-1">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8" />
          <span className="font-bold text-xl inline-block">RentHub</span>
        </Link>
        <div className="flex flex-col justify-start mt-12 h-full gap-4 w-full px-24">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Get Started Now</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to create an account.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full justify-between">
            <Button variant="outline" className="flex-1 gap-2 h-10 rounded-md">
              <GoogleIcon size={18} />
              Login with Google
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-10 rounded-md">
              <GithubIcon size={18} />
              Login with GitHub
            </Button>
          </div>
          <div className="flex items-center gap-4 my-4">
            <hr className="w-full" />
            <span className="text-muted-foreground">or</span>
            <hr className="w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="johndoe@gmail.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full h-10 rounded-md font-semibold bg-violet-600">
            Sign Up
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1 bg-violet-600 rounded-2xl"></div>
    </div>
  );
};

export default SignUpForm;
