import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { FieldValues, Path, PathValue } from 'react-hook-form'
import { TFloatingInputProps } from './types'

const FloatingInput = <T extends FieldValues>({
    type,
    label,
    error,
    name,
    register,
    setValue,
    className,
}: TFloatingInputProps<T>) => {
    const [isShown, setIsShown] = useState(false)

    const ref = useRef<HTMLInputElement>(null)

    const divClass = clsx(['w-full flex flex-col', className])

    return (
        <div className={divClass}>
            <div className="relative w-full">
                <Input
                    type={type === 'password' && !isShown ? 'password' : 'text'}
                    placeholder=""
                    className="floating-input relative w-full text-base placeholder-transparent peer border-primary pl-5"
                    {...register(name as Path<T>)}
                    onAnimationStart={(e) => {
                        if (e.animationName === 'autoFillStart') {
                            if (!ref.current) {
                                return
                            }
                            ref.current.focus()
                        }
                    }}
                    onChange={(e) => {
                        setValue(
                            name as Path<T>,
                            e.target.value as PathValue<T, Path<T>>
                        )
                    }}
                    ref={ref}
                />

                <Label
                    className="floating-label absolute z-30 text-center text-xs text-primary transition-all pointer-events-none -top-2 left-4 w-auto h-5 dark:bg-slate-950 bg-white leading-0 peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-[9px] px-1 peer-focus:-top-2
                    peer-focus:w-auto peer-focus:text-primary peer-focus:px-1
                    peer-fouse:leading-0 peer-focus:text-xs"
                >
                    {label}
                </Label>
                {type === 'password' && (
                    <Icon
                        icon={isShown ? 'carbon:view-off' : 'carbon:view'}
                        className="absolute text-xl -translate-y-1/2 cursor-pointer right-5 top-1/2 leading-0 "
                        onClick={() => {
                            setIsShown(!isShown)
                        }}
                    />
                )}
            </div>

            {error && (
                <p className="text-red-400 p-1 text-left text-xs h-full">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FloatingInput
