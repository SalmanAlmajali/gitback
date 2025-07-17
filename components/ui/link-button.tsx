import Link from 'next/link'
import React, { ReactNode } from 'react'
import { figtree } from '../fonts';

interface LinkButtonProps {
    href: string;
    className?: string;
    children: ReactNode;
}

function LinkButton({ href, className = "", children }: LinkButtonProps) {
    return (
        <Link href={href} className={`${figtree.className} bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm flex items-center justify-center gap-x-2 ${className}`}>
            {children}
        </Link>
    )
}

export default LinkButton