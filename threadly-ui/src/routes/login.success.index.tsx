import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLoader } from "@/components/app-loader";
import { LoginSuccesPage } from "@/components/pages/login";
import { useAuth } from "@/query/auth";

export const Route = createFileRoute("/login/success/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { auth, isLoading } = useAuth();

	if (isLoading) return <AppLoader />;

	if (!auth) return <Navigate to="/login" />;

	return <LoginSuccesPage auth={auth} />;
}
