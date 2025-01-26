import { adminAuth } from "@/utils/config/firebase-admin";
import { cookies } from "next/headers";

export type SessionUser = {
  uid: string;
  email: string | undefined;
};

export class SessionError extends Error {
  constructor(
    message: string,
    public code = "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "SessionError";
  }
}

export async function validateSession(): Promise<SessionUser> {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    throw new SessionError("ログインが必要です");
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    throw new SessionError("セッションが無効です", "INVALID_SESSION");
  }
}
