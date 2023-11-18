"use client"

import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  docId: string;
  open: boolean;
  onClose: () => void;
};
function ShareDialog({ docId, open, onClose }: Props) {

  async function handleAction (e: FormData) {
    const email = e.get("email");
    if (!email) return;
    if (typeof email !== "string") return;

    await fetch("/api/share", {
      method: "POST",
      body: JSON.stringify({
        docId,
        email,
      }),
    });

    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs/${docId}`);
    // const router = useRouter();
    // router.refresh();
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>Who are you chatting with?</DialogDescription>
        </DialogHeader>
        <form
          action={(e) => handleAction(e)}
          className="flex flex-row gap-4"
          // const result = await addDocumentAuthor(docId, email);
        >
          <Input placeholder="Email" name="email" />
          <Button type="submit">Add</Button>
        </form>
      </DialogContent>
      <Button 
        variant={"outline"}
        onClick={() => onClose()}
      >
        Close
      </Button>
    </Dialog>
  );
}

export default ShareDialog;
