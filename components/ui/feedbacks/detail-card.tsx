'use client';

import React, { useEffect, useState } from 'react'
import { figtree } from '@/components/fonts';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LinkButton from '@/components/ui/link-button';
import { IconPencil, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedbackWithImages } from '@/app/lib/feedbacks/definitions';
import { useSession } from 'next-auth/react';
import { Button } from '../button';
import ConnectGitHub from '../connect-github';
import { renderStatus, renderType } from './badges';
import { createGitHubIssue } from '@/app/lib/github/api';
import { toast } from 'sonner';
import { updateAfterSubmit } from '@/app/lib/feedbacks/actions';

function DetailCard({ feedback }: { feedback: FeedbackWithImages }) {
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const [gitHubIssue, setGitHubIssue] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        const owner = feedback.repository.fullName.split('/', 1)[0];
        const result = await createGitHubIssue(session.data?.accessToken, feedback, owner, feedback.repository.name)

        if (result.data && result.success) {
            const formData = new FormData();
            formData.append("gitHubIssue", result.data.html_url);

            const updateResult = await updateAfterSubmit(feedback.id, formData);

            if (updateResult?.success) {
                toast.success('Success', {
                    description: updateResult?.message
                });
                setGitHubIssue(result.data.html_url);
                setLoading(false);
            } else {
                toast.error("Error", {
                    description: updateResult?.error || updateResult?.message,
                });
            }
        } else {
            toast.error("Error", {
                description: result.error
            })

            setLoading(false)
        }
    }

    useEffect(() => {
        setGitHubIssue(feedback.gitHubIssue ?? '')
    }, [feedback])

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>
                    {feedback.title}
                </CardTitle>
                <CardDescription>
                    From <strong>{feedback.userName}</strong> ({feedback.userEmail}) •{" "}
                    {new Date(feedback.createdAt).toLocaleDateString('id-ID', {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    {renderType(feedback.type)}
                    {renderStatus(feedback.status)}
                </div>
                <div className="prose max-w-none">
                    <p>{feedback.content}</p>
                </div>

                {feedback.images.length > 0 && (
                    <div>
                        <h4 className={`${figtree.className} text-2xl font-bold leading-tight mb-4`}>
                            Attached Images
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {feedback.images.map(img => (
                                <div key={img.id} className="relative group border rounded overflow-hidden">
                                    <Image
                                        src={img.url}
                                        alt="feedback image"
                                        className="object-cover w-full"
                                        loading="lazy"
                                        width={1920}
                                        height={1080}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* {feedback.aiResults && (
                        <div className="bg-slate-50 p-4 rounded border">
                            <div className="flex items-center gap-2 mb-1">
                                <AiOutlineSearch className="w-5 h-5" />
                                <h4 className="text-lg font-semibold">AI Interpretation</h4>
                            </div>
                            {feedback.aiResults.aiTitle && (
                                <div className="mb-2">
                                    <p className="text-sm font-medium">Title (AI):</p>
                                    <p>{feedback.aiResults.aiTitle}</p>
                                </div>
                            )}
                            {feedback.aiResults.aiSummary && (
                                <div className="mb-2">
                                    <p className="text-sm font-medium">Summary:</p>
                                    <p>{feedback.aiResults.aiSummary}</p>
                                </div>
                            )}
                            {feedback.aiResults.stepsToReproduce && (
                                <div className="mb-2">
                                    <p className="text-sm font-medium">Steps to Reproduce:</p>
                                    <pre className="bg-white p-2 rounded text-xs overflow-auto">
                                        {feedback.aiResults.stepsToReproduce}
                                    </pre>
                                </div>
                            )}
                            {feedback.aiResults.expectedBehavior && (
                                <div>
                                    <p className="text-sm font-medium">Expected Behavior:</p>
                                    <p>{feedback.aiResults.expectedBehavior}</p>
                                </div>
                            )}
                        </div>
                    )} */}
            </CardContent>

            <CardFooter className="flex flex-col">
                <div className="text-sm text-muted-foreground self-start">
                    Last updated:{" "}
                    {new Date(feedback.updatedAt).toLocaleString('id-ID', {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </div>
                <CardAction className='flex flex-col-reverse md:flex-row-reverse justify-between items-center w-full mt-4'>
                    <div className='flex flex-row justify-between gap-2 mt-4 md:mt-0 w-full md:w-fit'>
                        <LinkButton
                            href="/dashboard/feedbacks"
                            className='px-4 py-2 rounded-lg'
                            variant='secondary'
                        >
                            Cancel
                        </LinkButton>
                        <Link
                            href={`/dashboard/feedbacks/${feedback.id}/edit`}
                            className="rounded-md border p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <IconPencil className="w-5 text-white" />
                        </Link>
                    </div>
                    {session.data?.accessToken !== undefined ? (
                        !gitHubIssue ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <IconRefresh className="mr-2 h-4 w-4 animate-spin" /> Sync...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Submit to GitHub issue
                                    </>
                                )}
                            </Button>
                        ) : (
                            <LinkButton href={gitHubIssue} className='flex px-4 py-2 rounded-md w-full justify-center md:w-fit'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='size-5'>
                                    <path
                                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                        fill="currentColor"
                                    />
                                </svg>
                                GitHub Issue
                            </LinkButton>
                        )
                    ) : (
                        <ConnectGitHub />
                    )}
                </CardAction>
            </CardFooter>
        </Card>
    )
}

export default DetailCard