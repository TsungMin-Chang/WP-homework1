import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useLike() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const likeTweet = async ({
    tweetId,
    userId,
  }: {
    tweetId: number;
    userId: number;
  }) => {
    if (loading) return;
    setLoading(true);
    const res = await fetch("/api/likes", {
      method: "POST",
      body: JSON.stringify({
        tweetId,
        userId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const unlikeTweet = async ({
    tweetId,
    userId,
  }: {
    tweetId: number;
    userId: number;
  }) => {
    if (loading) return;
    setLoading(true);
    
    const res = await fetch("/api/likes", {
      method: "DELETE",
      body: JSON.stringify({
        tweetId,
        userId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    likeTweet,
    unlikeTweet,
    loading,
  };
}
