import React from 'react'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {IBaseInputProps} from "@/components/base-input/types";

export const BaseInput = React.forwardRef<HTMLInputElement, IBaseInputProps>(
    function BaseInput(
        {
            label,
            error,
            placeholder,
            type,
            className,
            required = false,
            showLabel = true,
            ...rest
        },
        ref
    ) {
        return (
            <div className="flex flex-col text-[14px]">
                {showLabel && (
                    <Label
                        htmlFor="username"
                        className="mb-2 capitalize text-[12px]"
                    >
                        {label}{' '}
                        {required && <span className="text-kavya-red">*</span>}
                    </Label>
                )}
                <Input
                    ref={ref}
                    type={type}
                    {...rest}
                    placeholder={placeholder}
                    className={cn(
                        'border outline-none focus:border-primary rounded-[8px] disabled:bg-white disabled:cursor-not-allowed w-full text-[14px] disabled:text-gray-400',
                        className
                    )}
                />
                {error && (
                    <span className="text-xs text-red-600 mt-2">{error}</span>
                )}
            </div>
        )
    }
)
