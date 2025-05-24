// components/search-creators/search-creators.tsx
"use client";

import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import GetALLCreators from "@/app/action"; // Assuming this fetches all creators
import {TCreator} from "@/global/types"; // Assuming TCreator is globally defined
import {useQuery} from "@tanstack/react-query";

export function SearchCreators() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<TCreator[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const {data: creators = [], isLoading, error} = useQuery<TCreator[], Error>({
        queryKey: ["allCreators"],
        queryFn: GetALLCreators,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (value.length > 0 && creators) {
            const filteredSuggestions = creators.filter(
                (creator) =>
                    creator.userName.toLowerCase().includes(value.toLowerCase()) ||
                    creator.firstName.toLowerCase().includes(value.toLowerCase()) ||
                    (creator.lastName && creator.lastName.toLowerCase().includes(value.toLowerCase()))
            );
            setSuggestions(filteredSuggestions.slice(0, 5)); // Limit suggestions
            setShowSuggestions(true);
        } else if (creators && value.length === 0) { // Show all creators if query is empty but input is focused
            setSuggestions(creators.slice(0, 5)); // Limit initial suggestions
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleFocus = () => {
        if (query.length === 0 && creators && creators.length > 0) {
            setSuggestions(creators.slice(0, 5)); // Show initial suggestions (e.g., first 5)
            setShowSuggestions(true);
        } else if (query.length > 0 && suggestions.length > 0) {
            setShowSuggestions(true); // Re-show existing filtered suggestions
        }
    };

    const handleSuggestionClick = (userName: string) => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
        router.push(`/${userName}`);
    };

    if (error) {
        console.error("Failed to fetch creators:", error.message);
        // return <p className="text-red-500">Error loading creators.</p>;
    }

    return (
        <div className="relative w-full max-w-md" ref={searchContainerRef}>
            <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus} // Updated onFocus handler
                placeholder={isLoading ? "Loading creators..." : "Search creators..."}
                className="w-full"
                disabled={isLoading}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((creator) => (
                        <li
                            key={creator.creatorId}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSuggestionClick(creator.userName)}
                        >
                            <div className="flex items-center space-x-2">
                                {creator.profilePicture && (
                                    <img
                                        src={creator.profilePicture}
                                        alt={creator.userName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-medium text-sm">
                                        {creator.firstName} {creator.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        @{creator.userName}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showSuggestions && query.length > 0 && suggestions.length === 0 && !isLoading && (
                <div
                    className="absolute z-10 w-full mt-1 px-4 py-2 bg-background border border-border rounded-md shadow-lg"
                >
                    <p className="text-sm text-muted-foreground">No creators found.</p>
                </div>
            )}
        </div>
    );
}