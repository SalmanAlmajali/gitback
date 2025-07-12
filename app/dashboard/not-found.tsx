import FuzzyText from '@/components/blocks/TextAnimations/FuzzyText/FuzzyText'
import LinkButton from '@/components/ui/link-button'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Not Found'
}

function NotFound() {
    return (
        <main className="flex h-screen flex-col items-center justify-center gap-2">
            <FuzzyText
                baseIntensity={0.2}
                fontFamily='Figtree'
                color={'#000'}
                className={'block dark:hidden'}
            >
                404
            </FuzzyText>
            <FuzzyText
                baseIntensity={0.2}
                fontFamily='Figtree'
                color={'#fff'}
                className={'hidden dark:block'}
            >
                404
            </FuzzyText>
            <p className='text-center mt-4'>Could not find the requested page.</p>
            <LinkButton
                href={'/dashboard'}
                className='py-2 px-4 rounded-lg'
            >
                Go back
            </LinkButton>
        </main>
    )
}

export default NotFound