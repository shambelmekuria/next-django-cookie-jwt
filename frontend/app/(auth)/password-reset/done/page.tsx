import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import React from "react";

function Page() {
  return (
    <section className="flex justify-center items-center min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <Card className="px-5 md:py-10 rounded">
        <div className="flex gap-2">
          <div className="bg-green-200 text-700 p-4 h-14 w-14 rounded-full">
            <ShieldCheck />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl mb-1">Request received.</h1>
            <p className="text-xs md:text-sm">
              If an account exists with this email, password reset instructions have been sent.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default Page;
