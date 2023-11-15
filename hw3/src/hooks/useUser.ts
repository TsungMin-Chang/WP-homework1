import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useUser() {

  const searchParams = useSearchParams();
  const username = useMemo(() => searchParams.get("username"), [searchParams]);
  const userid = useMemo(() => searchParams.get("userid"), [searchParams]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postUser = async ({
    displayName
  } : {
    displayName: string;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        displayName,
      }),
    });

    if (res.status !== 200) {
      const body = await res.json();
      throw new Error(body.error);
    } else {
      const body = await res.json();
      const [{id: userid}] = body.data;
      router.refresh();
      setLoading(false);
      return userid;
    }
  };

  return {
    username,
    userid,
    postUser,
    loading,
  };
}

