'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { figtree } from '@/components/fonts';
import LinkButton from '../link-button';
import { ThemeSwitcher } from '../theme/theme-switcher';
import ApplicationLogo from '../application-logo';
import { useSession } from 'next-auth/react';
import { Button } from '../button';
import { IconMenu2 } from '@tabler/icons-react';

function Navbar() {
    const session = useSession();

    const navs = [
        {
            label: 'Home',
            href: '/'
        },
        {
            label: 'Dashboard',
            href: '/dashboard'
        },
    ];

    const pathname = usePathname()

    const [open, setOpen] = useState(false);

    return (
        <div className='fixed w-full mt-4 flex flex-col md:flex-row justify-center px-4'>
            <div className='max-w-5xl w-full py-3 px-4 md:px-8 rounded-xl md:rounded-full bg-accent/5 backdrop-blur-sm ring ring-accent flex justify-between items-center shadow-2xl'>
                <Link href={'/'} className={`${figtree.className} text-2xl font-bold`}>
                    <ApplicationLogo />
                </Link>
                <nav className='text-sm hidden md:flex items-center gap-x-10'>
                    {navs?.map((item, i) => {
                        if (item.href === '/dashboard') {
                            return (
                                (
                                    <Link href={item?.href} key={i} className={clsx("",
                                        {
                                            '': pathname === item?.href,
                                            'group': pathname !== item?.href,
                                            'hidden': session.status === 'unauthenticated',
                                        },
                                    )}>
                                        <NavLabel
                                            label={item?.label}
                                            pathname={pathname}
                                            href={item?.href}
                                        />
                                    </Link>
                                )
                            )
                        } else {
                            return (
                                <Link href={item?.href} key={i} className={clsx("",
                                    {
                                        '': pathname === item?.href,
                                        'group': pathname !== item?.href,
                                    },
                                )}>
                                    <NavLabel
                                        label={item?.label}
                                        pathname={pathname}
                                        href={item?.href}
                                    />
                                </Link>
                            )
                        }
                    })}
                </nav>
                <div className='flex items-center gap-x-4'>
                    {session.status === 'unauthenticated' && (
                        <LinkButton
                            href={'/auth/sign-in'}
                            className='rounded-full pr-1 pl-2 py-1 hidden md:inline-flex'
                        >
                            <span>Sign in</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </LinkButton>
                    )}
                    <ThemeSwitcher />
                    <Button onClick={() => setOpen(!open)} className='inline-flex md:hidden'>
                        <IconMenu2 />
                    </Button>
                </div>
            </div>
            <div className={clsx('md:hidden bg-accent/5 backdrop-blur-sm ring ring-accent rounded-xl transition-all duration-300 shadow-md mt-2',
                {
                    'max-h-96 py-2 opacity-100': open === true,
                    'max-h-0 opacity-0 overflow-hidden': open === false,
                }
            )}>
                <nav className='flex flex-col gap-y-1 px-4'>
                    {navs?.map((item, i) => {
                        if (item.href === '/dashboard') {
                            return (
                                (
                                    <LinkButton href={item?.href} key={i} className={clsx("px-4 py-2 rounded-lg",
                                        {
                                            'bg-primary px-4 py-2 rounded-lg text-primary-foreground': pathname === item?.href,
                                            'group': pathname !== item?.href,
                                            'hidden': session.status === 'unauthenticated',
                                        },
                                    )}>
                                        {item.label}
                                    </LinkButton>
                                )
                            )
                        } else {
                            return (
                                <LinkButton href={item?.href} key={i} className={clsx("px-4 py-2 rounded-lg",
                                    {
                                        'bg-primary text-primary-foreground': pathname === item?.href,
                                        'bg-transparent': pathname !== item?.href,
                                    },
                                )}>
                                    {item.label}
                                </LinkButton>
                            )
                        }
                    })}
                    <div className='border-t mt-2'>
                        <LinkButton
                            href={'/auth/sign-in'}
                            variant='secondary'
                            className='rounded-lg pr-1 pl-2 py-1 mt-2 justify-center'
                        >
                            <span>Sign in</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </LinkButton>
                        <LinkButton
                            href={'/auth/sign-up'}
                            variant='secondary'
                            className='rounded-lg pr-1 pl-2 py-1 mt-2 justify-center'
                        >
                            <span>Sign up</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </LinkButton>
                    </div>
                </nav>
            </div>
        </div>
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