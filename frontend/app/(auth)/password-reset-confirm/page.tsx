"use client"

import { useEffect } from "react"
import PasswordResetConfirm from "@/components/auth/password-reset-confirm"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const params = useSearchParams()
  const uid = params.get("uid") ?? ""
  const token = params.get("token") ?? ""

  // Update title dynamically in the client
  useEffect(() => {
    document.title = "Password Reset Confirm"
  }, [])

  return <PasswordResetConfirm uid={uid} token={token} />
}
