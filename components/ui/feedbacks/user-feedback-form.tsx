'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import MyInput, { MyTextArea } from '@/components/ui/my-input'
import { IconAdjustmentsStar, IconAppsFilled, IconBugFilled, IconDeviceFloppy, IconFileUpload, IconHeading, IconLoader2, IconMail, IconTextCaption, IconUser } from '@tabler/icons-react'
import { cn } from '@/app/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { figtree } from '@/components/fonts';
import { UserSelectedRepository } from '@prisma/client';
import { createFeedback } from '@/app/lib/feedbacks/actions';
import { toast } from 'sonner';

function UserFeedbackForm({
    repository,
    className,
    ...props
}: {
    repository: UserSelectedRepository,
    className?: React.ComponentProps<"div">
}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        const result = await createFeedback(formData);

        if (result?.success) {
            toast.success('Success', {
                description: result?.message
            });
        } else {
            toast.error("Error", {
                description: result?.error || result?.message,
            });
        }

        setLoading(false);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className='rounded-none md:rounded-xl'>
                <CardHeader>
                    <CardTitle className={`${figtree.className} text-xl`}>Gitback</CardTitle>
                    <CardDescription>
                        Submit your feedback below about {repository.name}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={handleSubmit} className='grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-4'>
                        <div>
                            <MyInput
                                name={'repositoryId'}
                                type={'hidden'}
                                defaultValue={repository.id}
                            />
                            <div className="mb-4">
                                <label htmlFor="userName" className="mb-2 block text-sm font-medium">
                                    Username
                                </label>
                                <MyInput
                                    name={'userName'}
                                    type={'text'}
                                    placeholder={"Enter username"}
                                    icon={<IconUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
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
                                            />
                                            <label
                                                htmlFor="bug"
                                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                                            >
                                                Bug <IconBugFilled className="h-4 w-4" />
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="feature_request"
                                                name="type"
                                                type="radio"
                                                value="FEATURE_REQUEST"
                                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
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
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="mb-2 block text-sm font-medium">
                                    Content
                                </label>
                                <MyTextArea
                                    name={'content'}
                                    icon={<IconTextCaption className="pointer-events-none absolute left-3 top-10 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
                                    rows={7}
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
                            <Button type='submit' disabled={loading} className='w-full'>
                                {loading ? (
                                    <>
                                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Submiting...
                                    </>
                                ) : (
                                    <>
                                        <IconDeviceFloppy />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserFeedbackForm