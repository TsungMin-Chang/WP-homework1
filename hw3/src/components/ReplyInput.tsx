"use client";

import { useRef } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
import useTweet from "@/hooks/useTweet";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";

type ReplyInputProps = {
  replyToTweetId: number;
};

export default function ReplyInput({
  replyToTweetId,
}: ReplyInputProps) {
  const { username, userid } = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet, loading } = useTweet();

  const handleReply = async () => {
    if (!userid) return;
    const content = textareaRef.current?.value;
    const userid_int = parseInt(userid);
    if (!content) return;
    if (!userid_int) return;

    try {
      await postTweet({
        userId: userid_int,
        content,
        replyToTweetId,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div onClick={() => textareaRef.current?.focus()}>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <p className="col-start-2 row-start-1 text-gray-500">
          {username} Say something...
        </p>
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500"
          placeholder="Tweet your reply"
        />
      </div>
      <div className="p-4 text-end">
        <button
          className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
