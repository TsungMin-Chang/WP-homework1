import { useState } from "react";

import { useRouter } from "next/navigation";

import {PostTweetRequest} from "../app/api/tweets/route";

export default function useTweet() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postTweet = async ({
    userId,
    content,
    timestart,
    timeend,
    replyToTweetId,
  } : PostTweetRequest) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({
        userId,
        content,
        timestart,
        timeend,
        replyToTweetId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
  };

  return {
    postTweet,
    loading,
  };
}
