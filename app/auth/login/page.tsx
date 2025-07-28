import { LoginForm } from "@/components/ui/login/login-form"
import LetterGlitch from "@/components/blocks/Backgrounds/LetterGlitch/LetterGlitch"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
    title: 'Login'
}

export default function Page() {
    return (
        <>
            <LetterGlitch
                glitchSpeed={0}
                centerVignette={false}
                outerVignette={true}
                smooth={true}
                glitchColors={["#61cf5a", "#63ad58", "#50864c", "#3e6a3d", "#3b4b33"]}
            />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                    <Toaster />
                </div>
            </div>
        </>
    )
}
