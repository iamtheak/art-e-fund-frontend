import ContentTab from "@/app/new-signin/content/_component/content";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getContentTypes} from "@/app/new-signin/content/action";

export default async function ContentPage() {

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['contentTypes'],
        queryFn: getContentTypes
    });

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ContentTab />
            </HydrationBoundary>
        </div>
    );
}