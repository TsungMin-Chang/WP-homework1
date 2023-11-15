"use client";

import { useRouter } from "next/navigation";

// import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <button
      className={cn(
        "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
        "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
      )}
      // go to home page without any query params to allow the user to change their username and handle
      // see src/components/NameDialog.tsx for more details
      onClick={() => router.push("/")}
    >
      <h1>Change user</h1>
    </button>
  );
}
