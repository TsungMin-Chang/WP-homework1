"use client"
import { BiError } from "react-icons/bi";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function DocsPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    const temp = window.document.getElementById("items");
    if (temp && temp.children) {
      const items = Array.prototype.slice.call(temp.children);
      let count = 0;
      items.map((item) => {
        if (item.textContent.indexOf(keyword) === -1) {
          item.style.display = "None";
          count = count + 1;
        } else {
          item.style.display = "flex";
        }
      })
      if (keyword && keyword !== "" && count === items.length) {
        alert("Please create a chat room with this person to start chatting!");
        return;
      }
    }
  }, [router]);

  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <BiError className="text-yellow-500" size={80} />
        <p className="text-sm font-semibold text-slate-700">
          Please select a document to edit
        </p>
      </div>
    </div>
  );
}
export default DocsPage;
