"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      try {
        const res = await axios.post("/api/auth/logout");
        if (res) {
          setLoading(false);
          return router.push("/login");
        }
      } catch {
        return router.push("/login");
      }
    };
    logout();
  }, []);
  return <>{loading && <div>Loading.....</div>}</>;
}
