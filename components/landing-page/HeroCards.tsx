import Image from "next/image";

export const HeroCards = () => {
    return (
        <div className="hidden lg:flex gap-8 relative w-full h-[400px]">
            <Image className={"object-contain"} fill src={"/landing/hero2.jpg"} alt={"A content creator"}/>
        </div>
    );
};
