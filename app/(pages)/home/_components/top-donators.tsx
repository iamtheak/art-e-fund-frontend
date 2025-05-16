// app/(pages)/home/_components/top-donators.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX } from "lucide-react"; // Icon for anonymous

// Define the structure for a donator (can be moved to a shared types file)
export type Donator = {
    id: string;
    name: string | null; // Null for anonymous
    avatarUrl: string | null; // Null for anonymous or if no avatar
    amount: number;
    message?: string; // Optional message
};

type TopDonatorsProps = {
    donators: Donator[];
};

// Make this a standard component accepting props
export default function TopDonators({ donators }: TopDonatorsProps) {
    return (
        <Card> {/* Removed mt-4, handle spacing in parent grid */}
            <CardHeader>
                <CardTitle>Top Donators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {donators.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No donations recorded yet.</p>
                ) : (
                    donators.map((donator, index) => (
                        <div key={donator.id || `anon-${index}`} className="flex items-start justify-between gap-4"> {/* Align items start */}
                            <div className="flex items-start gap-3"> {/* Align items start */}
                                <Avatar className="h-9 w-9 flex-shrink-0"> {/* Prevent shrinking */}
                                    {donator.avatarUrl ? (
                                        <AvatarImage src={donator.avatarUrl} alt={donator.name ?? "Donator"} />
                                    ) : null}
                                    <AvatarFallback>
                                        {donator.name ? (
                                            donator.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                        ) : (
                                            <UserX className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-grow"> {/* Allow text to wrap */}
                                    <p className="text-sm font-medium leading-none">
                                        {donator.name ?? "Anonymous"}
                                    </p>
                                    {/* Display a message if it exists */}
                                    {donator.message && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">
                                            {donator.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm font-semibold flex-shrink-0"> {/* Prevent shrinking */}
                                Rs. {donator.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}