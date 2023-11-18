"use client"

import { AiFillDelete, AiFillFileAdd, AiFillFileText } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { publicEnv } from "@/lib/env/public";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';

type DocumentProps = {
  id: number;
  userId: string;
  documentId: string;
  document: {
      title: string;
      displayId: string;
  };
}

async function Navbar() {
  
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id ?? "";
  console.log(userId);

  if (!userId) return;

  const handleGET = async () => {  
    const result = await fetch("/api/navbar2", {
      method: "POST",
      body: JSON.stringify({
        userId
      }),
    });
    if (!result.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await result.json();
    return data.documents as DocumentProps[];
  }
  const handlePOST = async () => {
    await fetch("/api/navbar", {
      method: "POST",
      body: JSON.stringify({
        userId
      }),
    });
  }
  const handleDELETE = async (docId: string) => {
    await fetch("/api/navbar", {
      method: "DELETE",
      body: JSON.stringify({
        documentId: docId,
      }),
    });
  }

  const documents = await handleGET();
  return (
    <nav className="flex w-full flex-col overflow-y-scroll bg-slate-100 pb-10">
      <nav className="sticky top-0 flex flex-col items-center justify-between border-b bg-slate-100 pb-2">
        <div className="flex w-full items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2">
            <RxAvatar />
            <h1 className="text-sm font-semibold">
              {session?.user?.username ?? "User"}
            </h1>
          </div>
          <Link href={`/auth/signout`}>
            <Button
              variant={"ghost"}
              type={"submit"}
              className="hover:bg-slate-200"
            >
              Sign Out
            </Button>
          </Link>
        </div>

        <form
          className="w-full hover:bg-slate-200"
          action={async () => {
            const newDocId = await handlePOST();
            router.refresh();
            redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs/${newDocId}`);
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm text-slate-500"
          >
            <AiFillFileAdd size={16} />
            <p>Create Chat Room</p>
          </button>
        </form>
      </nav>
      <section className="flex w-full flex-col pt-3">
        {documents.map((doc, i) => {
          return (
            <div
              key={i}
              className="group flex w-full cursor-pointer items-center justify-between gap-2 text-slate-400 hover:bg-slate-200 "
            >
              <Link
                className="grow px-3 py-1"
                href={`/docs/${doc.document.displayId}`}
              >
                <div className="flex items-center gap-2">
                  <AiFillFileText />
                  <span className="text-sm font-light ">
                    {doc.document.title}
                  </span>
                </div>
              </Link>
              <form
                className="hidden px-2 text-slate-400 hover:text-red-400 group-hover:flex"
                action={async () => {
                  const docId = doc.document.displayId;
                  await handleDELETE(docId);
                  router.refresh();
                  redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/docs`);
                }}
              >
                <button type={"submit"}>
                  <AiFillDelete size={16} />
                </button>
              </form>
            </div>
          );
        })}
      </section>
    </nav>
  );
}

export default Navbar;
