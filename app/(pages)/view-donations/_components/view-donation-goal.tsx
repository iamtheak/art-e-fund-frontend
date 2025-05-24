"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Progress} from "@/components/ui/progress";
import {format} from "date-fns";
import {Check, Edit2, Plus, X} from "lucide-react";
import Loader from "@/components/loader";
import {donationGoalSchema, TDonationGoal} from "@/app/(pages)/view-donations/_components/validator";
import {
    createDonationGoal,
    fetchAllDonationGoals,
    setGoalInactive,
    updateDonationGoal
} from "@/app/(pages)/view-donations/action";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/hooks/use-toast";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";

export default function ViewDonationGoal({creatorId}: { creatorId: number }) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    const [isOpen, setOpen] = useState(false);
    const {data: goals = [], isLoading} = useQuery<TDonationGoal[]>({
        queryKey: ['donationGoals'],
        queryFn: () => fetchAllDonationGoals(creatorId),
    });

    const updateGoalMutation = useMutation({
        mutationFn: updateDonationGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['donationGoals']});
            setIsEditing(false);
        },
        onError: (error) => {
            toast({title: "Error updating goal", description: error.message, variant: "destructive"});
        }
    });

    const createGoalMutation = useMutation({
        mutationFn: createDonationGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['donationGoals']});
            setIsCreating(false);
            createForm.reset();
        },
        onError: (error) => {
            toast({title: "Error creating goal", description: error.message, variant: "destructive"});
        }
    });

    const deactivateGoalMutation = useMutation({
        mutationFn: setGoalInactive,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['donationGoals']});
        },
        onError: (error) => {

            toast({title: "Error deactivating goal", description: error.message, variant: "destructive"});
        }
    });

    const activeGoal = goals.find(goal => goal.isGoalActive) || null;
    const pastGoals = goals.filter(goal => !goal.isGoalActive);

    // Create form
    const createForm = useForm<TDonationGoal>({
        resolver: zodResolver(donationGoalSchema),
        defaultValues: {
            creatorId: creatorId,
            goalTitle: "",
            goalDescription: "",
            goalAmount: 1000,
            goalProgress: 0,
            createdAt: new Date(),
            isGoalReached: false,
            isGoalActive: true
        }
    });

    // Edit form
    const editForm = useForm<TDonationGoal>({
        resolver: zodResolver(donationGoalSchema),
    });

    const handleEditClick = () => {
        if (activeGoal) {
            editForm.reset(activeGoal);
            setIsEditing(true);
        }
    };

    const handleCreateClick = () => {
        createForm.reset();
        setIsCreating(true);
    };

    const handleDeactivateClick = () => {
        if (activeGoal) {
            deactivateGoalMutation.mutate(activeGoal.goalId ?? 0);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsCreating(false);
    };

    if (isLoading) {
        return <Loader text="Loading donation goals..."/>;
    }

    return (
        <div className="container relative w-full h-full ">
            {(updateGoalMutation.isPending || createGoalMutation.isPending || deactivateGoalMutation.isPending) &&
                <Loader text="Processing..."/>}

            <ConfirmationDialog open={isOpen} description={"Do you want to deactivate the donation goal"}
                                title={"Deactivate donation goal"} actionVariant={"destructive"} setOpen={setOpen}
                                action={handleDeactivateClick}/>
            <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="current">Current Goal</TabsTrigger>
                    <TabsTrigger value="past">Past Goals</TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                    <Card className={"w-full"}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Current Donation Goal</span>
                                {activeGoal && !isEditing && !isCreating && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setOpen(true);
                                        }}>
                                            Deactivate
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleEditClick}>
                                            <Edit2 className="h-4 w-4 mr-2"/> Edit Goal
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                            <CardDescription>Your active fundraising goal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!activeGoal && !isCreating ? (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground mb-4">No active donation goal.</p>
                                    <Button onClick={handleCreateClick}>
                                        <Plus className="h-4 w-4 mr-2"/> Create New Goal
                                    </Button>
                                </div>
                            ) : isCreating ? (
                                <Form {...createForm}>
                                    <form onSubmit={createForm.handleSubmit((data) => createGoalMutation.mutate(data))}
                                          className="space-y-4">
                                        <FormField
                                            control={createForm.control}
                                            name="goalTitle"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Goal Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="goalAmount"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Goal Amount</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={e => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="goalDescription"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex gap-2 justify-end">
                                            <Button type="button" variant="outline" onClick={handleCancelClick}>
                                                <X className="h-4 w-4 mr-2"/> Cancel
                                            </Button>
                                            <Button type="submit">
                                                <Check className="h-4 w-4 mr-2"/> Create Goal
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : isEditing ? (
                                <Form {...editForm}>
                                    <form onSubmit={editForm.handleSubmit((data) => {
                                            return updateGoalMutation.mutate(data)
                                        }
                                    )} className="space-y-4">
                                        <FormField
                                            control={editForm.control}
                                            name="goalTitle"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Goal Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={editForm.control}
                                            name="goalAmount"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Goal Amount</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={e => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={editForm.control}
                                            name="goalDescription"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex gap-2 justify-end">
                                            <Button type="button" variant="outline" onClick={handleCancelClick}>
                                                <X className="h-4 w-4 mr-2"/> Cancel
                                            </Button>
                                            <Button type="submit">
                                                <Check className="h-4 w-4 mr-2"/> Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (activeGoal !== null && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium">{activeGoal.goalTitle}</h3>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Goal Progress</h4>
                                        <div className="mt-2">
                                            <Progress value={(activeGoal.goalProgress / activeGoal.goalAmount) * 100}/>
                                            <div className="flex justify-between mt-1 text-sm">
                                                <span>Rs. {activeGoal.goalProgress}</span>
                                                <span>Rs. {activeGoal.goalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Description</h4>
                                        <p className="text-muted-foreground">{activeGoal.goalDescription}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="past">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Goals</CardTitle>
                            <CardDescription>History of your previous donation goals</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pastGoals.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No past donation goals found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pastGoals.map((goal) => (
                                        <Card key={goal.goalId}>
                                            <CardContent className="pt-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium">{goal.goalTitle}</h3>
                                                        <p className="text-muted-foreground">{goal.goalDescription}</p>
                                                    </div>
                                                    <span
                                                        className={`text-sm px-2 py-1 rounded-full ${
                                                            goal.isGoalReached
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                                                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
                                                        }`}>
                                                       {goal.isGoalReached ? "Completed" : "Ended"}
                                                   </span>
                                                </div>
                                                <div className="mb-2">
                                                    <Progress value={(goal.goalProgress / goal.goalAmount) * 100}/>
                                                    <div className="flex justify-between mt-1 text-sm">
                                                        <span>Rs. {goal.goalProgress}</span>
                                                        <span>Rs. {goal.goalAmount}</span>
                                                    </div>
                                                </div>
                                                {goal.createdAt && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Created on {format(new Date(goal.createdAt), "MMM dd, yyyy")}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}