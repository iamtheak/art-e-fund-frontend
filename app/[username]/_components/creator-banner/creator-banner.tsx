import Image from "next/image";

export default async function CreatorBanner({image}: { image: string }) {

    return (
        <div className={"w-full h-80"}>
            <Image src={`${image}?q_auto:best&f_auto&w=1920`} alt={""} width={100} height={100} className={"w-full h-full object-cover"} priority quality={100}/>
        </div>
    )
}