import { auth } from "@/auth";
import Stripe from "stripe";
import { prisma } from "./prisma";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2024-06-20",
});

export async function hasSubscription() {
  const session = await auth();

  if (session) {
    const user = await prisma.user.findFirst({
      where: { email: session.user?.email },
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripeCustomerId),
    });

    return subscriptions.data.length > 0;
  }

  return false;
}

export async function generateCustomerPortalLink(customerId: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXTAUTH_URL + "/settings",
    });

    return portalSession.url;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function createCheckoutLink(customer: string) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/?success=false`,
    customer: customer,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_KEY,
        quantity: 1,
      },
    ],
    mode: "subscription",
  });

  return checkout.url;
}

export async function createCustomerIfNull() {
  const session = await auth();

  if (session) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: session.user?.email },
      });

      if (!user?.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user?.email,
        });

        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            stripeCustomerId: customer.id,
          },
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
