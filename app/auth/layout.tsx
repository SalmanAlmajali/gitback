import Navbar from '@/components/ui/navbar'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default layout