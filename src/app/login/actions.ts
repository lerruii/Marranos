"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, isValidPassword, SESSION_COOKIE } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!isValidPassword(password)) {
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(from && from.startsWith("/") ? from : "/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
