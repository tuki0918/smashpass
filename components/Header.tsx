import SiteTextLogo from "@/components/SiteTextLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

const Header: FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const handleLogin = () => setIsLoggedIn(true);
	const handleLogout = () => setIsLoggedIn(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center justify-between px-2">
				<div className="flex items-center space-x-2">
					<Link href={"/"}>
						<SiteTextLogo />
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					{!isLoggedIn ? (
						<Button onClick={handleLogin}>Login</Button>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage src="https://picsum.photos/100" alt="User" />
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">username</p>
										<p className="text-xs leading-none text-muted-foreground">
											user@example.com
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
