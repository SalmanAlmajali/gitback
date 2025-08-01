'use client';

import { FeedbackImage, UserSelectedRepository } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { figtree } from '@/components/fonts';
import { IconAdjustmentsStar, IconAppsFilled, IconBookmarks, IconBugFilled, IconCancel, IconClockFilled, IconDeviceFloppy, IconFileUpload, IconHeading, IconLoader2, IconMail, IconTextCaption, IconTrash, IconUser } from '@tabler/icons-react';
import MyInput, { MyTextArea } from '../my-input';
import { updateFeedback } from '@/app/lib/feedbacks/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LinkButton from '../link-button';
import { Button } from '../button';
import { FeedbackWithImages } from '@/app/lib/feedbacks/definitions';
import Image from 'next/image';
import clsx from 'clsx';
import { deleteImage } from '@/app/lib/feedback-images/actions';

function EditForm({
    feedback,
    repositories
}: {
    feedback: FeedbackWithImages;
    repositories: UserSelectedRepository[] | undefined;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');
    const [images, setImages] = useState<FeedbackImage[]>([]);

    const updateFeedbackWithId = async (e: any) => {
        e.preventDefault();
        
        setLoading(true)

        const form = e.target;
        const formData = new FormData(form);

        const result = await updateFeedback(feedback.id, formData)

        if (result?.success) {
            toast.success('Success', {
                description: result?.message
            });
            setLoading(false);
            router.push('/dashboard/feedbacks');
        } else {
            toast.error("Error", {
                description: result?.error || result?.message,
            });

            setLoading(false);
        }
    }

    const handleDeleteImage = async (feedbackImage: FeedbackImage) => {
        setIdToDelete(feedbackImage.id)

        const result = await deleteImage(feedbackImage)

        if (result?.success) {
            setImages(prev => prev.filter(img => img.id !== feedbackImage.id));

            toast.success('Success', {
                description: result?.message
            });
            setIdToDelete('');
        } else {
            toast.error("Error", {
                description: result?.error || result?.message,
            });

            setIdToDelete('');
        }
    }

    useEffect(() => {
        setImages(feedback.images);
    }, [feedback])

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`${figtree.className} text-2xl font-bold leading-tight`}>Update Feedback</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={updateFeedbackWithId} encType='multipart/form-data'>
                    <div className='grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-4'>

                        <div>
                            <div className="mb-4">
                                <label htmlFor="repositoryId" className="mb-2 block text-sm font-medium">
                                    Repository
                                </label>
                                <div className="relative">
                                    <select
                                        id="repositoryId"
                                        name="repositoryId"
                                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        defaultValue={feedback.repositoryId}
                                    >
                                        <option value="" disabled>
                                            Select a repository
                                        </option>
                                        {repositories === undefined ? (
                                            <option value="" disabled className='text-black'>
                                                No repository was found
                                            </option>
                                        ) : (
                                            repositories.map((repo) => (
                                                <option key={repo.id} value={repo.id} className='text-black'>
                                                    {repo.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <IconBookmarks className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userName" className="mb-2 block text-sm font-medium">
                                    Username
                                </label>
                                <MyInput
                                    name={'userName'}
                                    type={'text'}
                                    placeholder={"Enter username"}
                                    icon={<IconUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    defaultValue={feedback.userName}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userEmail" className="mb-2 block text-sm font-medium">
                                    Email
                                </label>
                                <MyInput
                                    name={'userEmail'}
                                    type={'email'}
                                    placeholder={"Enter user email address"}
                                    icon={<IconMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    defaultValue={feedback.userEmail}
                                />
                            </div>
                            <fieldset className='mb-4'>
                                <legend className="mb-2 block text-sm font-medium">
                                    Feedback Type
                                </legend>
                                <div className="rounded-md border px-[14px] py-3">
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center">
                                            <input
                                                id="bug"
                                                name="type"
                                                type="radio"
                                                value="BUG"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                                defaultChecked={feedback.type === "BUG"}
                                            />
                                            <label
                                                htmlFor="bug"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Bug <IconBugFilled className="h-4 w-4" />
                                            </label>
                                        </div>
                                        <div className="flex  items-center">
                                            <input
                                                id="feature_request"
                                                name="type"
                                                type="radio"
                                                value="FEATURE_REQUEST"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                                defaultChecked={feedback.type === "FEATURE_REQUEST"}
                                            />
                                            <label
                                                htmlFor="feature_request"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Feature Request <IconAppsFilled className="h-4 w-4" />
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="other"
                                                name="type"
                                                type="radio"
                                                value="OTHER"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                                defaultChecked={feedback.type === "OTHER"}
                                            />
                                            <label
                                                htmlFor="other"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Other <IconAdjustmentsStar className="h-4 w-4" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className='mb-4'>
                                <legend className="mb-2 block text-sm font-medium">
                                    Feedback Status
                                </legend>
                                <div className="rounded-md border px-[14px] py-3">
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center">
                                            <input
                                                id="pending"
                                                name="status"
                                                type="radio"
                                                value="PENDING"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                                defaultChecked={feedback.status === "PENDING"}
                                            />
                                            <label
                                                htmlFor="pending"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Pending <IconClockFilled className="h-4 w-4" />
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="rejected"
                                                name="status"
                                                type="radio"
                                                value="REJECTED"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                                defaultChecked={feedback.status === "REJECTED"}
                                            />
                                            <label
                                                htmlFor="rejected"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Rejected <IconCancel className="h-4 w-4" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                                    Title
                                </label>
                                <MyInput
                                    name={'title'}
                                    type={'text'}
                                    placeholder={"Enter feedback title"}
                                    icon={<IconHeading className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    defaultValue={feedback.title}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="mb-2 block text-sm font-medium">
                                    Content
                                </label>
                                <MyTextArea
                                    name={'content'}
                                    icon={<IconTextCaption className="pointer-events-none absolute left-3 top-10 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    rows={10}
                                    defaultValue={feedback.content}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="images" className="mb-2 block text-sm font-medium">
                                    Images
                                </label>
                                <MyInput
                                    name={'images'}
                                    type={'file'}
                                    icon={<IconFileUpload className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    accept='image/*'
                                    multiple
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className={clsx(`${figtree.className} text-2xl font-bold leading-tight mb-4 mt-10`,
                        {
                            'hidden': images?.length === 0,
                        }
                    )}>Uploaded images</h2>
                    <div className={`grid grid-rows-${feedback.images.length} grid-cols-1 md:grid-rows-${feedback.images.length / 2} md:grid-cols-2 gap-4`}>
                        {images?.map((image, i) => {
                            const isDeleting = image.id === idToDelete;
                            return (
                                <div key={i} className='p-4 space-y-2 bg-neutral-100 dark:bg-neutral-900 rounded-2xl'>
                                    <Image
                                        src={image.url}
                                        alt={feedback.title}
                                        width={1920}
                                        height={720}
                                        loading="lazy"
                                        className='rounded-xl shadow-xl'
                                    />
                                    <div className='flex justify-between'>
                                        <span>{image.url.split('/')[2]}</span>
                                        <Button
                                            disabled={isDeleting}
                                            variant={'destructive'}
                                            onClick={() => handleDeleteImage(image)}
                                        >
                                            {isDeleting ? (
                                                <IconLoader2 className='animate-spin' />
                                            ) : (
                                                <IconTrash />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='flex flex-col-reverse md:flex-row md:justify-end gap-2 mt-4'>
                        <LinkButton
                            href="/dashboard/feedbacks"
                            className='px-4 py-2 rounded-lg'
                            variant='secondary'
                        >
                            Cancel
                        </LinkButton>
                        <Button type='submit' disabled={loading}>
                            {loading ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy />
                                    Update Feedback
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default EditForm