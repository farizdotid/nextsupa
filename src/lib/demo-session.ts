import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/lib/demo";

/** Store the fake session (the user's email) in an httpOnly cookie. */
export async function setDemoSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Remove the fake session. */
export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);
}
