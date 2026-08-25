import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getPrisma, hasDatabaseUrl } from "./prisma";

export async function getSessionUserId() {
  const { userId } = await auth();
  return userId;
}

type ClerkProfile = {
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};

// Fetch the current Clerk profile so deleted or invalid accounts fail closed
// instead of being mapped to a fabricated local identity.
async function getClerkProfile(clerkUserId: string): Promise<ClerkProfile> {
  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  const primary =
    user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId) ??
    user.emailAddresses[0];

  if (!primary) {
    throw new Error("The signed-in Clerk account has no email address.");
  }

  return {
    email: primary.emailAddress.toLowerCase(),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
  };
}

export async function requireSyncedUser() {
  const clerkUserId = await getSessionUserId();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  if (!hasDatabaseUrl) {
    return clerkUserId;
  }

  const profile = await getClerkProfile(clerkUserId);
  const prisma = await getPrisma();

  // Anchor the workspace to the email address so signing in with the same email
  // always returns to the same records, even if Clerk issues a new user id.
  const existingByEmail = (await prisma.user.findFirst({
    where: { email: profile.email },
    orderBy: { createdAt: "asc" },
  })) as { id: string } | null;

  if (existingByEmail) {
    await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        imageUrl: profile.imageUrl,
      },
    });
    return existingByEmail.id;
  }

  // First time we see this email: use the current Clerk id as the stable anchor
  // (migrating any pre-existing row for this id).
  await prisma.user.upsert({
    where: { id: clerkUserId },
    create: {
      id: clerkUserId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      imageUrl: profile.imageUrl,
    },
    update: {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      imageUrl: profile.imageUrl,
    },
  });

  return clerkUserId;
}
