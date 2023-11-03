import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { Check } from "lucide-react";

type TweetProps = {
  username?: string;
  userid:number;
  id: number;
  authorName: string;
  content: string;
  timestart: number | null;
  timeend: number | null;
  likes: number;
  createdAt: Date;
  liked?: boolean;
  state: boolean
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  username,
  userid,
  id,
  authorName,
  content,
  likes,
  liked,
  state,
}: TweetProps) {
  
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            userid
          },
        }}
      >
        <div className="flex gap-4">
          <article className="flex grow flex-col">
            {!state && (
              <p className="font-bold">
                {authorName}:
              </p>
            )}
            {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
            <article className="mt-2 whitespace-pre-wrap">{content}</article>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              {state && liked  && (
                <Check size={30} />
              )}
            </div>
            <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
              { state && (<h1>{likes ? likes : 0} people</h1>) }
            </div>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}
