import { figtree } from '@/components/fonts'
import { AppSidebar } from '@/components/ui/layout/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/layout/sidebar/sidebar'
import { SiteHeader } from '@/components/ui/layout/site-header'
import { Breadcrumb } from '@/app/lib/definitions'
import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant='inset' />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className='@container/main flex flex-1 flex-col gap-2'>
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default layout

export const PageTitle = ({ title }: { title: string }) => (
    <h1 className={`${figtree.className} scroll-m-20 mb-4 text-2xl font-extrabold tracking-tight text-balance`}>
        {title}
    </h1>
)

export const Breadcrumbs = ({
    breadcrumbs,
}: {
    breadcrumbs: Breadcrumb[];
}) => (
    <nav aria-label="Breadcrumb" className="mb-6 block">
        <ol className={clsx(figtree.className, 'flex text-lg md:text-2xl font-extrabold tracking-tight')}>
            {breadcrumbs.map((breadcrumb, index) => (
                <li
                    key={breadcrumb.href}
                    aria-current={breadcrumb.active}
                    className={clsx(
                        breadcrumb.active ? 'text-black dark:text-white' : 'text-neutral-500',
                    )}
                >
                    <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    {index < breadcrumbs.length - 1 ? (
                        <span className="mx-3 inline-block">/</span>
                    ) : null}
                </li>
            ))}
        </ol>
    </nav>
)