'use client'
import { fetcher } from '@/lib/fecher'
import { useAuth } from '@/providers/auth-providers'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import useSWR from 'swr'

export default function Page() {
  const router = useRouter()
  const {data,error,isLoading} = useSWR('api/auth/refresh',fetcher);
  useEffect(()=>{
    if(error){
      router.push('/login')
    }
  })
  console.log(data)
  const auth = useAuth()
 if(isLoading || error){
  return <div>Loading........</div>
 }
  return (
    <div>Page {auth?.fullname}</div>
  )
}
