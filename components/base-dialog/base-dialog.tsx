import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {cn} from "@/lib/utils";

export type TBaseDialogProps = {
    title: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>> | (() => void);
    onClose?: () => void;
    children: ReactNode;
    description?: string;
    footer?: ReactNode;
    className?: string;
    defaultOpen?: boolean;
};

const BaseDialog = ({
                        title,
                        isOpen,
                        setIsOpen,
                        onClose,
                        children,
                        description,
                        footer,
                        className,
                        defaultOpen
                    }: TBaseDialogProps) => {
    return (
        <Dialog open={isOpen} defaultOpen={defaultOpen} onOpenChange={setIsOpen}>
            <DialogContent className={cn("", className)} onInteractOutside={onClose} onEscapeKeyDown={onClose}>
                <DialogHeader>
                    <DialogTitle className={"text-2xl"}>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div>{children}</div>
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
};

export default BaseDialog;
