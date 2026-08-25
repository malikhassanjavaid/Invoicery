import assert from "node:assert/strict";

const baseUrl = process.env.AUTH_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const forgedHeader = encode({ alg: "RS256", typ: "JWT", kid: "fake" });
const forgedPayload = encode({
  azp: new URL(baseUrl).origin,
  exp: now + 60,
  iat: now,
  iss: "https://example.clerk.accounts.dev",
  nbf: now - 1,
  sid: "sess_deleted",
  sub: "user_deleted",
});
const forgedSignature = Buffer.alloc(256, 1).toString("base64url");
const forgedToken = `${forgedHeader}.${forgedPayload}.${forgedSignature}`;

const response = await fetch(new URL("/", baseUrl), {
  headers: {
    cookie: `__session=${forgedToken}`,
  },
  redirect: "manual",
});

assert.equal(response.status, 200, "The public home page should remain accessible");

const html = await response.text();

assert.match(
  html,
  /Get Started/,
  "An unverified session cookie must not put the app into a signed-in state",
);

console.log("Unverified session cookies are rejected.");
