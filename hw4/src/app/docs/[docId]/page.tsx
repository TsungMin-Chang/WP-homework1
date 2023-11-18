"use client";

import { useDocument } from "@/hooks/useDocument";
import { Button } from "@/components/ui/button";
import ShareDialog from "../../_components/ShareDialog";
import { useState, useEffect } from 'react';

// type DataProps = {
//   email: string;
//   id: string;
//   username: string;
// }

async function DocPage({ params }: {params: { docId: string }}) {

  const [openShareDialog, setOpenShareDialog] = useState(false);
  // const [authors, setAuthors] = useState<DataProps[]>([]);
  const { title, setTitle, content, setContent } = useDocument();  
  
  useEffect(() => {
    const searchAuthors = async () => {
      const res = await fetch(`/api/searchauthors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docId: params.docId,
        }),
      });
      if (!res.ok) {
        return;
      }
      await res.json()
        .then((a) => console.log(a.authors));
    }
    searchAuthors();
  }, [params.docId])

  // console.log(authors.length)
  // if (authors.length < 2) {
  //   setOpenShareDialog(true);
  // }

  return (
    <div className="w-full">
      <nav className="sticky top-0 flex w-full justify-between p-2 shadow-sm">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Document Title"
          className="rounded-lg px-2 py-1 text-slate-700 outline-0 focus:bg-slate-100"
        />
        <Button 
          variant={"outline"}
          onClick={() => setOpenShareDialog(true)}
        >
          Share
        </Button>
      </nav>
      <section className="w-full px-4 py-4">
        <textarea
          value={content || ""}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="h-[80vh] w-full outline-0 "
        />
      </section>
      <ShareDialog 
        docId={params.docId} 
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
      />
    </div>
  );
}

export default DocPage;
