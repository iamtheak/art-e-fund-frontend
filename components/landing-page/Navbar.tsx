"use client";
import {useState} from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {Menu} from "lucide-react";
import {ModeToggle} from "./mode-toggle";
import {LogoIcon} from "./Icons";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {SearchCreators} from "@/components/search-creators/search-creators";

interface RouteProps {
    href: string;
    label: string;
}

const routeList: RouteProps[] = [
    {
        href: "#how-it-works",
        label: "How it works",
    },
    {
        href: "#creators",
        label: "Creators",
    },
    {
        href: "#faq",
        label: "FAQ",
    },
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const session = useSession();

    const isAuthenticated = session.status === "authenticated";

    return (
        <header
            className="m-5 sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
            <NavigationMenu className="mx-auto">
                <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
                    <NavigationMenuItem className="font-bold flex">
                        <Link
                            rel="noreferrer noopener"
                            href="/"
                            className="ml-2 font-bold text-xl flex"
                        >
                            Art-E Fund
                        </Link>
                    </NavigationMenuItem>

                    {/* mobile */}
                    <span className="flex md:hidden">
            <ModeToggle/>

            <Sheet
                open={isOpen}
                onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                    className="flex md:hidden h-5 w-5"
                    onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                      Art-E Fund
                  </SheetTitle>
                </SheetHeader>
                    <div className={"w-[90%] flex justify-center items-center gap-2 mt-4"}>
                        <SearchCreators/>
                    </div>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({href, label}: RouteProps) => (
                      <a
                          rel="noreferrer noopener"
                          key={label}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={buttonVariants({variant: "ghost"})}
                      >
                          {label}
                      </a>
                  ))}
                    <Link
                        href={isAuthenticated ? "/explore" : "/login"}
                        className={`w-[110px] border ${buttonVariants({
                            variant: "secondary",
                        })}`}
                    >
                        {isAuthenticated ? "Explore" : "Login"}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </span>
                    <nav className="hidden md:flex gap-2">
                        {routeList.map((route: RouteProps, i) => (
                            <a
                                rel="noreferrer noopener"
                                href={route.href}
                                key={i}
                                className={`text-[17px] ${buttonVariants({
                                    variant: "ghost",
                                })}`}
                            >
                                {route.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden md:flex gap-2">
                        <SearchCreators/>
                        <Link
                            href={isAuthenticated ? "/explore" : "/login"}
                            className={`border ${buttonVariants({variant: "secondary"})}`}
                        >
                            {isAuthenticated ? "Explore" : "Login"}
                        </Link>

                        <ModeToggle/>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
};
