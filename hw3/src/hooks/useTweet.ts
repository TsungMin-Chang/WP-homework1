import { useState } from "react";

import { useRouter } from "next/navigation";

import type { PostTweetRequest } from "../app/api/tweets/route";

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

    if (res.status !== 200) {
      const body = await res.json();
      throw new Error(body.error);
    } else {
      const body = await res.json();
      const [{id: tweetid}] = body.data;
      router.refresh();
      setLoading(false);
      return tweetid;
    }

  };

  return {
    postTweet,
    loading,
  };
}
