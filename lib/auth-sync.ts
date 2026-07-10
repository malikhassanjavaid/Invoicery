import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { getPrisma, hasDatabaseUrl } from "./prisma";

function decodeBase64Url(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
    "utf8",
  );
}

export async function getClerkSessionClaims() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore
    .getAll()
    .find((cookie) => cookie.name.startsWith("__session"));

  if (!sessionCookie?.value) {
    return null;
  }

  const [, payload] = sessionCookie.value.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as {
      sub?: string;
      email?: string;
      given_name?: string;
      family_name?: string;
      image_url?: string;
    };
  } catch {
    return null;
  }
}

export async function getSessionUserId() {
  const claims = await getClerkSessionClaims();

  return claims?.sub ?? null;
}

type ClerkProfile = {
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};

// Read the signed-in user's real profile from Clerk's Backend API. This works
// with only the secret key (no Clerk middleware required) and, crucially, gives
// us the real email address — the session cookie does not contain one.
async function getClerkProfile(clerkUserId: string): Promise<ClerkProfile> {
  const fallback: ClerkProfile = { email: `${clerkUserId}@clerk.local` };

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    const primary =
      user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId) ??
      user.emailAddresses[0];

    return {
      email: primary?.emailAddress?.toLowerCase() ?? fallback.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    };
  } catch {
    // If the Clerk lookup fails, fall back to id-based identity so the app
    // still works (behaves like before this change).
    return fallback;
  }
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
