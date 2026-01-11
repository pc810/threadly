import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { AppLoader } from "@/components/app-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/query/auth";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: auth, isLoading } = useAuth();

	if (isLoading) return <AppLoader />;

	if (!auth) return <Navigate to="/login" />;

	return (
		<div className="[--header-height:calc(--spacing(14))]">
			<SidebarProvider className="flex flex-col max-h-screen">
				<Outlet />
			</SidebarProvider>
		</div>
	);
}
