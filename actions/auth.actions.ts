"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signupSchema, loginSchema, type SignupValues, type LoginValues } from "@/lib/schemas/auth.schema";
import { prisma } from "@/lib/prisma";
import { createStripeCustomer } from "@/actions/stripe.actions";


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
  redirect("/dashboard");
}

export async function signup(formData: SignupValues) {
  const supabase = await createClient();

  // Validate data
  const result = signupSchema.safeParse(formData);
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  const { data, error } = await supabase.auth.signUp({
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

  // Check if user already exists (identities will be empty if email is taken and enumeration protection is on)
  if (data?.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "A user with this email already exists." };
  }

  // ----- STRIPE INTEGRATION -----
  if (data?.user) {
    const { id: userId, email } = data.user;
    
    // 1. Create Stripe customer (non-blocking)
    // Wrap in try-catch/graceful handling internally via createStripeCustomer
    const stripeCustomerId = await createStripeCustomer(
      email as string, 
      formData.name
    );

    // 2. Create User record in local Database (Prisma)
    try {
      await prisma.user.create({
        data: {
          id: userId,
          email: email as string,
          fullName: formData.name,
          stripeCustomerId: stripeCustomerId,
        },
      });
      console.log(`Prisma user created for ${email}`);
    } catch (dbError) {
      // Requirements: do not block signup if non-auth parts fail
      console.error("Error linking user to database/stripe record:", dbError);
    }
  }
  // ------------------------------

  revalidatePath("/", "layout");
  redirect("/login?message=Check your email to confirm your account");
}


export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
