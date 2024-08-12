import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Settings() {
  const session = await getServerSession(authOptions);

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
