import {GiftIcon, MedalIcon} from "@/components/landing-page/Icons";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CameraIcon} from "lucide-react";

interface FeatureProps {
    icon: JSX.Element;
    title: string;
    description: string;
}

const features: FeatureProps[] = [
    {
        icon: <MedalIcon/>,
        title: "Creator page",
        description:
            "Creator page is a dedicated space for creators to showcase their work and connect with their audience.",
    },
    {
        icon: <CameraIcon className={"w-14 h-14 text-blue-500"}/>,
        title: "Posts",
        description:
            "Creators can share their content, updates, and engage with their followers through posts.",
    },
    {
        icon: <GiftIcon/>,
        title: "Donations",
        description:
            "Support your favorite creators by making donations to help them continue their work and projects.",
    },
];

export const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="container text-center py-24 sm:py-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold ">
                How It{" "}
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
                Step-by-Step Guide
            </h2>
            <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
                This is how Art-E Fund works, a step-by-step guide to help you
            </p>

            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map(({icon, title, description}: FeatureProps) => (
                    <Card
                        key={title}
                        className="bg-muted/50"
                    >
                        <CardHeader>
                            <CardTitle className="grid gap-4 place-items-center">
                                {icon}
                                {title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>{description}</CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};
