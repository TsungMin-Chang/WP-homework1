"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";


import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  initialLiked?: boolean;
  tweetId: number;
  userId: number;
};

export default function LikeButton({
  initialLiked,
  tweetId,
  userId,
}: LikeButtonProps) {

  const [liked, setLiked] = useState(initialLiked);
  
  const { likeTweet, unlikeTweet, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!userId) return;
    if (liked) {
      await unlikeTweet({
        tweetId,
        userId,
      });
      setLiked(false);
    } else {
      await likeTweet({
        tweetId,
        userId,
      });
      setLiked(true);
    }
  };

  return (
    <button
      className={liked ? cn(
        "my-2 rounded-full bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-brand/70",
        "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40"
      ) : cn(
        "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
        "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40"
      )}
      onClick={handleClick}
      disabled={loading}
    >
      {liked ? <h1>I had joined</h1> : <h1>I want to join</h1>}
    </button>
  );
}