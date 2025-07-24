import clsx from 'clsx';
import React from 'react'

interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
    isHidden?: boolean | undefined;
}

interface MyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    icon: React.ReactNode;
}

const MyInput: React.FC<MyInputProps> = ({ name, type, placeholder, icon, isHidden, ...props }: MyInputProps) => {
    return (
        <div className="relative mt-2 rounded-md">
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={clsx("peer block w-full rounded-md border py-2 pl-10 text-sm placeholder:text-gray-500",
                        {
                            'hidden': isHidden
                        }
                    )}
                    {...props}
                />
                {icon}
            </div>
        </div>
    )
}

export default MyInput

export const MyTextArea: React.FC<MyTextareaProps> = ({ name, icon, ...props }: MyTextareaProps) => {
    return (
        <div className="relative mt-2 rounded-md">
            <div className="relative">
                <textarea
                    id={name}
                    name={name}
                    className="peer block w-full rounded-md border py-2 pl-10 text-sm placeholder:text-gray-500"
                    rows={5}
                    {...props}
                ></textarea>
                {icon}
            </div>
        </div>
    )
}