import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TCreator} from "@/global/types";
import GetALLCreators from "@/app/action";


export const Testimonials = async () => {

    let creatorsData = await GetALLCreators()

    creatorsData = creatorsData.slice(0, 4)
    return (
        <section
            id="testimonials"
            className="container py-24 sm:py-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold">
                Meet Our
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
                    Featured Creators{" "}
        </span>
            </h2>

            <p className="text-xl text-muted-foreground pt-4 pb-8">
                Discover talented individuals sharing their passion on our platform.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto">
                {creatorsData.map(
                    (creator: TCreator) => (
                        <Card
                            key={creator.creatorId} // Use a unique key like creatorId
                            className="max-w-md md:break-inside-avoid overflow-hidden flex flex-col" // Added flex flex-col for better structure
                        >
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar>
                                    <AvatarImage
                                        alt={`${creator.firstName} ${creator.lastName}`}
                                        src={creator.profilePicture || undefined} // Handle null profilePicture
                                    />
                                    <AvatarFallback>
                                        {creator.firstName.charAt(0)}{creator.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">{creator.firstName} {creator.lastName}</CardTitle>
                                    <CardDescription>@{creator.userName}</CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-grow"> {/* Added flex-grow to allow content to expand */}
                                <p className="text-sm text-muted-foreground line-clamp-3"> {/* Added line-clamp for consistent height */}
                                    {creator.creatorBio || ""} {/* Use creatorBio as the comment */}
                                </p>
                                <p>
                                    {creator.creatorDescription || ""} {/* Use creatorDescription for additional info */}
                                </p>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        </section>
    );
};