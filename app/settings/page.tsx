import { Button } from "@/components/ui/button";
import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Settings() {
  const session = await auth();

  await createCustomerIfNull();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  const manageStripeUrl = await generateCustomerPortalLink(
    user?.stripeCustomerId as string,
  );

  const isSubscribed = await hasSubscription();

  const checkoutLink = await createCheckoutLink(
    user?.stripeCustomerId as string,
  );
  return (
    <div className="flex items-center justify-center">
      <Link href={manageStripeUrl as string}>
        <Button>Manage Account</Button>
      </Link>
      <div>
        {isSubscribed ? (
          "Subscribed"
        ) : (
          <Link href={checkoutLink as string}>Upgrade</Link>
        )}
      </div>
    </div>
  );
}
