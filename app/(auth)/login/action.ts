"use server";

import {signIn} from "@/auth";
import {AuthError} from "next-auth";

export async function loginRequest(email: string, password: string) {

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials" };
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

