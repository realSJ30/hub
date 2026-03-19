"use server";

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover' as any,
});


/**
 * Creates a Stripe customer for a user.
 * 
 * @param email - The user's email address
 * @param fullName - The user's full name
 * @returns The Stripe Customer ID or null if creation fails.
 */
export async function createStripeCustomer(email: string, fullName?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name: fullName,
      metadata: {
        // You could add your internal user ID here later if available
        source: 'renthub-signup'
      }
    });

    console.log(`Stripe customer created: ${customer.id} for ${email}`);
    return customer.id;
  } catch (error) {
    // Requirements: If it fails, do not block user signup. Log error.
    console.error(`Failed to create Stripe customer for ${email}:`, error);
    return null;
  }
}

/**
 * Checks if the currently authenticated user has an active Stripe subscription.
 * Returns { isPro: boolean }
 */
export async function getUserSubscriptionStatus() {
  try {
    const { createClient } = await import('@/utils/supabase/server');
    const { prisma } = await import('@/lib/prisma');
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { isPro: false };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || !dbUser.stripeCustomerId) {
      return { isPro: false };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: dbUser.stripeCustomerId,
      status: 'active',
    });

    return { isPro: subscriptions.data.length > 0 };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return { isPro: false };
  }
}

