import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface NavbarProps {
    user: User | null;
}

export function Navbar({ user }: NavbarProps) {
    return (
        <div className="flex justify-between mt-8 mb-12 mx-12">
            <Link className="text-3xl font-bold" href={user ? '/dashboard' : '/'}>
                Football Weekly Picks
            </Link>
            <div className="flex items-center gap-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        {user && <NavigationMenuItem>
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                                <Link href="/dashboard">Dashboard</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>}

                        {!user && <NavigationMenuItem>
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                                <Link href="/signin">Sign In</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>}

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                                <Link href="/how-it-works">How It Works</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {user && <NavigationMenuItem>
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                                <Link href="/signout">Sign Out</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>}
                    </NavigationMenuList>
                </NavigationMenu>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}