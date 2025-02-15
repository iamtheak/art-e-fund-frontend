export interface IBaseInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error: string | undefined
    placeholder: string
    type: React.InputHTMLAttributes<HTMLInputElement>['type']
    showLabel?: boolean
}
