// app/(pages)/(settings)/profile/@creator/creator-api.tsx
"use client";

import * as React from 'react';
import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import BaseDialog from '@/components/base-dialog/base-dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Edit3, Eye, EyeOff, KeyRound, Loader2, Trash} from 'lucide-react';
import {deleteCreatorApiKey, getCreatorApiKey, updateCreatorApiKey} from "@/app/(pages)/(settings)/profile/action";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";

interface CreatorApiProps {
    creatorId: number;
}

export default function CreatorApi({creatorId}: CreatorApiProps) {
    const {toast} = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const apiKeyQueryKey = ['creatorApiKey', creatorId];

    const {data: currentApiKey, isLoading: isLoadingApiKey} = useQuery<string | null, Error>({
        queryKey: apiKeyQueryKey,
        queryFn: () => getCreatorApiKey(creatorId),
        enabled: !!creatorId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const mutation = useMutation({
        mutationFn: (apiKeyToUpdate: string) => updateCreatorApiKey(creatorId, apiKeyToUpdate),
        onSuccess: (data) => {
            if (data.success) {
                toast({title: "Success", description: "API Key updated successfully."});
                queryClient.invalidateQueries({queryKey: apiKeyQueryKey});
                setIsDialogOpen(false);
                setNewApiKey(''); // Clear input after successful update
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to update API Key.",
                    variant: "destructive"
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
        },
    });

    const deleteApiKey = useMutation({
        mutationFn: async () => await deleteCreatorApiKey(),
        onSuccess: () => {
            toast({title: "Success", description: "API Key deleted successfully."});
            queryClient.invalidateQueries({queryKey: apiKeyQueryKey});
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
        },
    })

    const handleOpenDialog = () => {
        setNewApiKey(currentApiKey || ''); // Pre-fill with current key if available
        setIsDialogOpen(true);
    };

    const handleSaveApiKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newApiKey.trim()) {
            toast({title: "Validation Error", description: "API Key cannot be empty.", variant: "destructive"});
            return;
        }
        mutation.mutate(newApiKey);
    };

    const maskedApiKey = currentApiKey ? '••••••••••••••••••••' + currentApiKey.slice(-4) : 'Not set';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <KeyRound className="mr-2 h-5 w-5 text-gray-600"/>
                    Khalti API Secret Key
                </CardTitle>
                <CardDescription>
                    Manage your API secret key for Khalti integrations. Keep it confidential.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ConfirmationDialog action={async () => await deleteApiKey.mutateAsync()}
                                    description={"Are you sure you want to delete you api key"}
                                    open={isConfirmationOpen} setOpen={setIsConfirmationOpen}
                                    title={"Delete you Api Key"} actionVariant={"destructive"}/>
                <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/50">
                    {isLoadingApiKey ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Loading API Key...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <span className="text-sm font-mono mr-3">
                                {showApiKey ? (currentApiKey || "No API Key Set") : maskedApiKey}
                            </span>
                            {currentApiKey && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    aria-label={showApiKey ? "Hide API Key" : "Show API Key"}
                                >
                                    {showApiKey ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </Button>
                            )}
                        </div>
                    )}
                    <div className={"flex flex-col gap-5"}>

                        <Button variant="outline" size="sm" onClick={handleOpenDialog} disabled={isLoadingApiKey}>
                            <Edit3 className="mr-1 h-4 w-4"/>
                            {currentApiKey ? 'Edit' : 'Set'} Key
                        </Button>
                        <Button variant={"destructive"} size={"sm"} onClick={() => setIsConfirmationOpen(true)}>
                            <Trash className="mr-1 h-4 w-4"/>
                            Delete Key
                        </Button>
                    </div>
                </div>


                <BaseDialog
                    title={currentApiKey ? "Update API Secret Key" : "Set API Secret Key"}
                    description="Enter your new API secret key below. This key should be kept confidential."
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    onClose={() => mutation.isPending ? null : setIsDialogOpen(false)} // Prevent closing while mutating
                >
                    <form onSubmit={handleSaveApiKey} className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="apiKeyInput" className="sr-only">API Secret Key</Label>
                            <Input
                                id="apiKeyInput"
                                type="password"
                                placeholder="Enter your API secret key"
                                value={newApiKey}
                                onChange={(e) => setNewApiKey(e.target.value)}
                                disabled={mutation.isPending}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...
                                    </>
                                ) : (
                                    "Save Key"
                                )}
                            </Button>
                        </div>
                    </form>
                </BaseDialog>
            </CardContent>
        </Card>
    );
}