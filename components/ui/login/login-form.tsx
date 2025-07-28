'use client';

import { cn } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { figtree } from "@/components/fonts"
import { IconKey, IconLoader2, IconLogin2, IconMail } from "@tabler/icons-react"
import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import { authenticate } from "@/app/lib/users/actions";
import { signIn } from "next-auth/react";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [loading, setLoading] = useState(false);

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    useEffect(() => {
        toast.error("Error", {
            description: errorMessage
        });
    }, [errorMessage]);

    const handleSignWithGitHub = async () => {
        setLoading(true);

        await signIn('github', {
            callbackUrl: '/dashboard',
        })

        setLoading(false);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className={`${figtree.className} text-xl`}>Gitback</CardTitle>
                    <CardDescription>
                        Please login to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={formAction}>
                        <div className="mb-4">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium">
                                Email
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="peer block w-full rounded-md border py-2 pl-10 text-sm placeholder:text-gray-500"
                                    />
                                    <IconMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                Password
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="******"
                                        className="peer block w-full rounded-md border py-2 pl-10 text-sm placeholder:text-gray-500"
                                    />
                                    <IconKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Login...
                                </>
                            ) : (
                                <>
                                    <IconLogin2 />
                                    Login
                                </>
                            )}
                        </Button>
                    </form>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 rounded-md px-2">
                            Or continue with
                        </span>
                    </div>
                    <Button
                        variant="default"
                        className="w-full"
                        type="button"
                        onClick={handleSignWithGitHub}
                        disabled={loading}
                    >
                        {isPending ? (
                            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                        Login with GitHub
                    </Button>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <a href="/auth/signup" className="underline underline-offset-4">
                            Sign up
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
