'use client';

import React from 'react'
import { figtree } from '../fonts'
import Link from 'next/link'
import clsx from 'clsx';
import { ThemeSwitcher } from './theme-switcher';
import { usePathname } from 'next/navigation';
import LinkButton from './link-button';

function Navbar() {
    const navs = [
        {
            label: 'Home',
            href: '/'
        },
    ];

    const pathname = usePathname()

    return (
        <nav className='fixed w-full mt-4 flex justify-center'>
            <div className='max-w-5xl w-full py-3 px-8 rounded-full bg-accent/5 backdrop-blur-sm ring ring-accent flex justify-between items-center shadow-2xl'>
                <Link href={'/'} className={`${figtree.className} text-2xl font-bold`}>
                    Gitback
                </Link>
                <div className='text-sm flex items-center gap-x-10'>
                    {navs?.map((item, i) => (
                        <Link href={item?.href} key={i} className={clsx("",
                            {
                                '': pathname === item?.href,
                            },
                            {
                                'group': pathname !== item?.href,
                            },
                        )}>
                            <NavLabel
                                label={item?.label}
                                pathname={pathname}
                                href={item?.href}
                            />
                        </Link>
                    ))}
                </div>
                <div className='flex items-center gap-x-4'>
                    <LinkButton
                        href={'/auth/login'}
                        className='rounded-full pr-1 pl-2 py-1'
                    >
                        <span>Login</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </LinkButton>
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    )
}

export default Navbar

const NavLabel = (props: {
    label: string,
    pathname: string,
    href: string,
}) => (
    <span className="relative inline-flex overflow-hidden">
        <div className={clsx("translate-y-0 skew-y-0 transform-gpu transition-transform duration-500 group-hover:-translate-y-[110%] group-hover:skew-y-12",
            {
                "text-black dark:text-white": props?.pathname === props?.href,
            },
            {
                "text-neutral-400": props?.pathname !== props?.href,
            }
        )}>
            {props?.label}
        </div>

        <div className="absolute translate-y-[110%] skew-y-12 transform-gpu transition-transform duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
            {props?.label}
        </div>
    </span>
)