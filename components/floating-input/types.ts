import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"

export type TFloatingInputProps<T extends FieldValues> = {
    label: string
    type: string
    register: UseFormRegister<T>
    name: keyof T
    className?: string
    error?: string
    setValue: UseFormSetValue<T>
}
