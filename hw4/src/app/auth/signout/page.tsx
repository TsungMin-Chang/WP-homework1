"use client";

import { useEffect } from "react";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { publicEnv } from "@/lib/env/public";

function SignOutPage() {
  const { data: session } = useSession();
  console.log("Sign Out 1", session);
  const userId = session?.user?.id;
  console.log("Sign Out 2", userId);
  
  const router = useRouter();
  useEffect(() => {
    if (session) {
      signOut({ callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL });
    }
    router.push("/");
  }, [session, router]);

  return <></>;
}

export default SignOutPage;
