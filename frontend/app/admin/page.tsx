import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
   <>
    <div>Admin Page</div>
    <p>Do You Want To Logout <Link href='/logout'>Logout</Link></p>
   </>
  )
}
