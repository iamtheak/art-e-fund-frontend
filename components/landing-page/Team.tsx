import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Keep if other footer content might be added, otherwise remove
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TCreator } from "@/global/types"; // Import TCreator
import GetALLCreators from "@/app/action"; // Import the data fetching function
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For consistent avatar display



export const Team = async () => {
  // Fetch creator data
  let creatorsAsTeam = await GetALLCreators();


  creatorsAsTeam = creatorsAsTeam.slice(0, 4); // Example: Show first 4 creators

  return (
    <section id="creators" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Meet Our{" "}
        </span>
        Featured Creators
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Discover the talented individuals driving creativity on our platform.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {creatorsAsTeam.map((creator: TCreator) => (
          <Card
            key={creator.creatorId} // Use unique creatorId
            className="bg-muted/50 relative mt-8 flex flex-col justify-start items-center text-center" // Align text center
          >
            <CardHeader className="mt-8 flex flex-col justify-center items-center pb-2 w-full">
              <Avatar className="absolute -top-12 w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage
                  alt={`${creator.firstName} ${creator.lastName}`}
                  src={creator.profilePicture || undefined}
                />
                <AvatarFallback>
                  {creator.firstName?.charAt(0)}
                  {creator.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="pt-12"> {/* Adjusted padding */}
                {creator.firstName} {creator.lastName}
              </CardTitle>
              <CardDescription className="text-primary">
                {/* Display role, fallback to "Creator" */}
                {creator.role ? creator.role.charAt(0).toUpperCase() + creator.role.slice(1) : "Creator"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-2 px-4 flex-grow w-full"> {/* Added flex-grow and padding */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {/* Use creatorBio for the description */}
                {creator.creatorBio || "Passionate creator on our platform."}
              </p>
            </CardContent>

            {/* Social media links removed as they are not in TCreator */}
            {/* <CardFooter> ... </CardFooter> */}
          </Card>
        ))}
      </div>
    </section>
  );
};