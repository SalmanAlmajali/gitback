import Link from 'next/link'
import React, { ReactNode } from 'react'

function LinkButton(props: {
    href: string,
    className: string,
    children: ReactNode
}) {
    return (
        <Link href={props?.href} className={`bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm flex items-center gap-x-2 ${props?.className}`}>
            {props?.children}
        </Link>
    )
}

export default LinkButton