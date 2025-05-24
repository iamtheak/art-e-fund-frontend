"use client";
import Link from "next/link";
import {TCreator} from "@/global/types";
import {usePathname} from "next/navigation";

export interface PageNavListProps {
    creator: TCreator
}

export default function PageNavList({creator}: PageNavListProps) {

    const path = usePathname()

    return (
        <div className="border-b border-border mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
                <Link
                    href={`/${creator.userName}`}
                    className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                  ${!path.includes('/memberships') && !path.includes("/posts") ?
                        'border-yinmn-blue text-yinmn-blue' : 
                        'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`}
                >
                    About
                </Link>

                {(creator.hasPosts) && (
                    <Link
                        href={`/${creator.userName}/posts`}
                        className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                    ${path?.includes('/posts') ?
                            'border-yinmn-blue text-yinmn-blue' : // Assuming brand color
                            'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`}
                    >
                        Posts
                    </Link>
                )}

                {(creator.hasMembership) && (
                    <Link
                        href={`/${creator.userName}/memberships`}
                        className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                                            ${path?.includes('/memberships') ?
                            'border-yinmn-blue text-yinmn-blue' : // Assuming brand color
                            'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`}
                    >
                        Memberships
                    </Link>
                )}
            </nav>
        </div>
    );
}