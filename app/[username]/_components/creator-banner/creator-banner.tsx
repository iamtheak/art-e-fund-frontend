import Image from "next/image";

export default async function CreatorBanner({image}: { image: string | null }) {

    return (
        <div className={"w-full h-80"}>
            {
                image &&
                <img src={`${image}?q_auto:best&f_auto&w=1920`} alt={""}
                     className={"w-full h-full object-cover"}/>
            }
        </div>
    )
}