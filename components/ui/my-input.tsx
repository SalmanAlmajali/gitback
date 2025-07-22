import { SignupPayload } from '@/app/lib/definitions';
import { handleSetState } from '@/app/lib/utils';
import React from 'react'

interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    setPayload: React.Dispatch<React.SetStateAction<SignupPayload>>;
    icon: React.ReactNode;
}

const MyInput: React.FC<MyInputProps> = ({ name, type, placeholder, setPayload, icon }: MyInputProps) => {
    return (
        <div className="relative mt-2 rounded-md">
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    onChange={e => handleSetState(name, e.target.value, setPayload)}
                />
                {icon}
            </div>
        </div>
    )
}

export default MyInput