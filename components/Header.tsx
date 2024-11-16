"use client";

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
import { Link } from "@/utils/i18n/routing";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { useAuthSession } from "./AuthSessionProvider";

const Header: FC = () => {
	const { user, logout } = useAuthSession();
	const t = useTranslations("Components/Header");

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center items-center px-4 sm:px-6 lg:px-8">
			<div className="container max-w-7xl h-12 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Link href={"/"}>
						<SiteTextLogo />
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={user.photoURL || ""}
											alt="User Avatar Image"
										/>
										{/* TODO: dummy fallback avatar */}
										<AvatarFallback>00</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.displayName}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout}>
									<LogOut />
									{t("menu/logout")}
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
