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
