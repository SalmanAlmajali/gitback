import Squares from '@/components/blocks/Backgrounds/Squares/Squares'
import SignupForm from '@/components/ui/signup/signup-form'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'

function Page() {
    return (
        <>
            <Squares />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <SignupForm />
                    <Toaster />
                </div>
            </div>
        </>
    )
}

export default Page