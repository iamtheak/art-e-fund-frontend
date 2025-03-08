import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Icon} from "@iconify/react";

export type TConfirmationDialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
    action: () => void
    title: string
    description: string
}

export function ConfirmationDialog({
                                       open,
                                       setOpen,
                                       action,
                                       title,
                                       description
                                   }: TConfirmationDialogProps) {

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent
                className="w-[390px] py-[clamp(30px,_3.5vw,_60px)] px-[clamp(20px,_3.5vw,_40px)] rounded-[24px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className={"text-center"}>
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className={"flex flex-col gap-4 items-center"}>
                    <Icon width={75} height={75} icon={"carbon:warning"}/>
                    {description}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        action()
                        setOpen(false)
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}