import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Icon} from "@iconify/react";
import {Button, buttonVariants} from "@/components/ui/button"; // Import buttonVariants type if needed elsewhere

// Define possible variants for the action button, aligning with Button component variants
type ActionButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export type TConfirmationDialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
    action: () => void
    title: string
    description: string
    // Optional: Customize the icon (defaults to a warning icon)
    icon?: string;
    // Optional: Customize the action button's appearance (defaults to destructive)
    actionVariant?: ActionButtonVariant;
    // Optional: Customize the action button's text (defaults to "Continue")
    actionText?: string;
}

export function ConfirmationDialog({
                                       open,
                                       setOpen,
                                       action,
                                       title,
                                       description,
                                       icon = "carbon:warning-filled", // Default icon
                                       actionVariant = "destructive", // Default variant
                                       actionText = "Continue" // Default text
                                   }: TConfirmationDialogProps) {

    // Determine icon color based on action variant for visual cue
    const iconColorClass = actionVariant === 'destructive' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100';

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="sm:max-w-md rounded-lg p-6 shadow-lg border"> {/* Added border */}
                <AlertDialogHeader
                    className="flex flex-col items-center text-center space-y-3"> {/* Adjusted spacing */}
                    {/* Icon container with background color and padding */}
                    <div className={`p-2.5 rounded-full ${iconColorClass}`}>
                        <Icon width={32} height={32} icon={icon}/> {/* Adjusted icon size */}
                    </div>
                    {/* Title styling */}
                    <AlertDialogTitle className="text-lg font-medium"> {/* Adjusted font weight */}
                        {title}
                    </AlertDialogTitle>
                    {/* Description styling */}
                    <AlertDialogDescription
                        className="text-sm text-muted-foreground px-2"> {/* Added slight horizontal padding */}
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant={actionVariant}
                            onClick={action}
                        >
                            {actionText}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}