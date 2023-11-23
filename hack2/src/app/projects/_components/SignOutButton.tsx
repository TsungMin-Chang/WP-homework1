// TODO: 4. Call the signOut() function when the button is clicked
// hint: You may want to change the first line of this file
import { signOut } from "next-auth/react";
import { publicEnv } from "@/lib/env/public";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button data-testid="sign-out-button" 
            variant={"outline"} 
            onClick={ async () => {
              "use server"
               await signOut({ callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL });
            }}
    >
      Sign Out
    </Button>
  )
}
  // okay
  // TODO: 4. end
