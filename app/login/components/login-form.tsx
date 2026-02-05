"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Car } from "lucide-react";
import Link from "next/link";
import GoogleIcon from "@/components/icons/google.icon";
import GithubIcon from "@/components/icons/github.icon";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const LoginForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    } as LoginValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submitted values:", value);
      alert("Login successful!");
    },
  });

  return (
    <div className="flex md:flex-row flex-col py-4 gap-6 justify-between px-4 sm:px-8 md:px-12 mx-auto w-full min-h-screen font-sans">
      <div className="flex flex-col gap-4 flex-1">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8" />
          <span className="font-bold text-xl inline-block">RentHub</span>
        </Link>
        <div className="flex flex-col justify-center mt-8 md:mt-12 flex-1 gap-4 w-full max-w-lg mx-auto md:max-w-none md:px-12 lg:px-24">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2 h-10 rounded-md"
              type="button"
            >
              <GoogleIcon size={18} />
              Login with Google
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2 h-10 rounded-md"
              type="button"
            >
              <GithubIcon size={18} />
              Login with GitHub
            </Button>
          </div>
          <div className="flex items-center gap-4 my-2">
            <hr className="w-full" />
            <span className="text-muted-foreground text-sm">or</span>
            <hr className="w-full" />
          </div>

          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="johndoe@gmail.com"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="rememberMe"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(!!checked)
                          }
                          aria-invalid={isInvalid}
                        />
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-normal text-sm"
                        >
                          Remember me for 30 days
                        </FieldLabel>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full h-10 rounded-md font-semibold bg-primary mt-6"
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              )}
            />
          </form>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-col px-12 py-8 justify-start flex-1 bg-primary rounded-2xl text-white p-6 relative">
        <h2 className="text-2xl font-semibold mt-34 leading-tight">
          The simplest way to manage <br /> your rental properties
        </h2>
        <p className="text-neutral-200 mt-4 text-sm">
          RentHub is a platform that helps you manage your rental properties.
        </p>
        <Image
          src="/signin-hero.svg"
          alt="Sign In Hero"
          width={500}
          height={500}
          className="absolute bottom-32 right-10 opacity-90"
          priority
        />
      </div>
    </div>
  );
};

export default LoginForm;
