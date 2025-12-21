import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <>
      <div>Page</div>
      <p>
        Do You Want To Logout <Link href="/logout" className="text-blue-600 font-bold">Logout</Link>
      </p>
    </>
  );
}
