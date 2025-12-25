'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter()
  return (
    <div className="h-screen flex items-center justify-center p-6 md:10">
      <div className="max-w-md">
        <Card className="rounded p-10">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="mb-3 h-16 w-16 rounded-full bg-green-500 text-slate-50 flex justify-center items-center">
              <CircleCheck size={40} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Password reset successful
            </h1>
            <p className="text-sm text-center"> You can now use your new password to login to your account</p>
            <Button className="h-10  w-full" onClick={() => router.push('/login')}>Login </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;