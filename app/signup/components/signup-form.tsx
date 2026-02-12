"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { signupSchema, type SignupValues } from "@/lib/schemas/auth.schema";
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
import { signup } from "@/actions/auth.actions";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    } as SignupValues,
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      const result = await signup(value);
      if (result?.error) {
        setError(result.error);
      }
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
            <h1 className="text-2xl font-semibold">Get Started Now</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to create an account.
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

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {message && (
            <Alert className="border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600">
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertTitle>{message}</AlertTitle>
            </Alert>
          )}

          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="John Doe"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
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
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
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
              </form.Field>

              <form.Field name="terms">
                {(field) => {
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
                          Accept terms and conditions
                        </FieldLabel>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full h-10 rounded-md font-semibold bg-primary mt-6"
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <p className="text-center mt-4 text-sm">
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
        <h2 className="text-2xl font-semibold mt-34 leading-tight">
          The simplest way to manage <br /> your rental properties
        </h2>
        <p className="text-neutral-200 mt-4 text-sm">
          RentHub is a platform that helps you manage your rental properties.
        </p>
        <Image
          src="/signin-hero.svg"
          alt="Sign Up Hero"
          width={500}
          height={500}
          className="absolute bottom-32 right-10 opacity-90"
          priority
        />
      </div>
    </div>
  );
};

export default SignUpForm;
