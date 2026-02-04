import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import Link from "next/link";
import GoogleIcon from "@/components/icons/google.icon";
import GithubIcon from "@/components/icons/github.icon";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const SignUpForm = () => {
  return (
    <div className="flex md:flex-row flex-col py-4 gap-6 justify-between px-4 sm:px-8 md:px-12 mx-auto w-full min-h-screen">
      <div className="flex flex-col gap-4 flex-1">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8" />
          <span className="font-bold text-xl inline-block">RentHub</span>
        </Link>
        <div className="flex flex-col justify-center mt-8 md:mt-12 flex-1 gap-4 w-full max-w-lg mx-auto md:max-w-none md:px-12 lg:px-24">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Get Started Now</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to create an account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2 h-10 rounded-md"
            >
              <GoogleIcon size={18} />
              Login with Google
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2 h-10 rounded-md"
            >
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
            <PasswordInput id="password" placeholder="••••••••" />
          </div>
          <FieldGroup className="w-full mt-4">
            <Field orientation="horizontal">
              <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
              <FieldLabel htmlFor="terms-checkbox-basic">
                Accept terms and conditions
              </FieldLabel>
            </Field>
          </FieldGroup>
          <Button className="w-full h-10 rounded-md font-semibold bg-primary mt-4">
            Sign Up
          </Button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col px-12 py-8 justify-start flex-1 bg-primary rounded-2xl text-white p-6 relative">
        <h2 className="text-2xl font-semibold mt-34">
          The simplest way to manage <br /> your rental properties
        </h2>
        <p className="text-neutral mt-4 text-sm">
          RentHub is a platform that helps you manage your rental properties.
        </p>
        <Image
          src="/signin-hero.svg"
          alt="Sign Up"
          width={500}
          height={500}
          className="absolute bottom-32 right-10 opacity-90"
        />
      </div>
    </div>
  );
};

export default SignUpForm;
