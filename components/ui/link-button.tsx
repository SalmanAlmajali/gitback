import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode } from 'react'

function LinkButton({
    href,
    className,
    variant = 'default',
    children
} : {
    href: string,
    className: string,
    variant?: string | undefined,
    children: ReactNode
}) {
    return (
        <Link href={href} className={clsx(`text-sm flex items-center gap-x-2 ${className}`,
            {
                "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200": variant === 'default',
                "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80": variant === 'secondary',
            }
        )}>
            {children}
        </Link>
    )
}

export default LinkButton