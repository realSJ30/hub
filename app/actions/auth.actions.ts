"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signupSchema, loginSchema, type SignupValues, type LoginValues } from "@/lib/schemas/auth.schema";

export async function login(formData: LoginValues) {
  const supabase = await createClient();

  // Validate data
  const result = loginSchema.safeParse(formData);
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: SignupValues) {
  const supabase = await createClient();

  // Validate data
  const result = signupSchema.safeParse(formData);
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Check your email to confirm your account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
