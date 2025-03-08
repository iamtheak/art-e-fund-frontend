"use client"
import {getContentTypes} from "@/app/new-signin/content/action";
import {useRouter} from "next/navigation";
import {useNewCreatorStore} from "@/providers/new-creator/provider";
import {useQuery} from "@tanstack/react-query";
import {useCallback} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ContentTypeItem} from "@/app/new-signin/content/_component/content-item";

export default function ContentTab() {
    const router = useRouter();

    const {contentTypeId, setContentType} = useNewCreatorStore();

    const {data: contents, isLoading, error} = useQuery({
        queryKey: ['contentTypes'],
        queryFn: getContentTypes,
        staleTime: Infinity,
    });


    const handleSelect = useCallback((id: number) => {
        setContentType(id);
    }, [setContentType]);

    const handleNext = useCallback(() => {
        router.push('/new-signin/bio');
    }, [router]);

    if (isLoading) {
        return (
            <Card className="animate-pulse">
                <CardHeader
                    className="text-xl text-center mb-5">
                    Loading content types...
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-50">
                <CardHeader className="text-xl text-center mb-5 text-red-600">
                    Error loading content types
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-xl text-center mb-5">
                Choose the type of content you will create!
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {contents?.map((content) => (
                        <ContentTypeItem
                            key={content.contentTypeId}
                            content={content}
                            isSelected={contentTypeId === content.contentTypeId}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex gap-5 justify-end">
                <Button variant="outline" className="h-11 w-20" asChild>
                    <Link href="/new-signin/new-creator">Back</Link>
                </Button>
                <Button
                    onClick={handleNext}
                    className="h-11 w-20"
                    disabled={!contentTypeId}
                >
                    Next
                </Button>
            </CardFooter>
        </Card>
    );
}