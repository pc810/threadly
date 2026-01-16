import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { userDtoAtom } from "@/atoms/profile";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUserByUsername } from "@/query/user";

export const Route = createFileRoute("/_app/user/$username")({
	component: RouteComponent,

	loader: async ({ params }) => {
		const userDto = await getUserByUsername(params.username);

		if (!userDto) throw notFound();

		return userDto;
	},
});

function RouteComponent() {
	const userDTO = Route.useLoaderData();

	const setUserDto = useSetAtom(userDtoAtom);

	useEffect(() => {
		setUserDto(userDTO);
	}, [userDTO, setUserDto]);

	return (
		<>
			<SiteHeader />
			<div className="flex flex-1">
				<AppSidebar />
				<SidebarInset className="flex-1 min-h-0  pt-14">
					<Outlet />
				</SidebarInset>
			</div>
		</>
	);
}
