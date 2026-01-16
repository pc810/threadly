import { createFileRoute, Outlet, useLoaderData } from "@tanstack/react-router";
import { AppLayout, AppWidgetLayout } from "@/components/layout/app-layout";
import { UserProfileHeader } from "@/components/user/header";
import { UserProfileWidget } from "@/components/user/profile-widget";
import { kwId } from "@/lib/utils";

export const Route = createFileRoute("/_app/user/$username/_profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const userDTO = useLoaderData({ from: "/_app/user/$username" });

	return (
		<AppLayout key={kwId("profile-header", userDTO.id)}>
			<div>
				<UserProfileHeader />
				<Outlet />
			</div>

			<AppWidgetLayout>
				<UserProfileWidget userDto={userDTO} />
			</AppWidgetLayout>
		</AppLayout>
	);
}
