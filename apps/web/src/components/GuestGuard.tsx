"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

export default function GuestGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat")
    }
  }, [status, router])

  if (status === "loading") return <p>Loading...</p>

  return <>{children}</>
}
