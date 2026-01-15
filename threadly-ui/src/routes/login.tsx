import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLoader } from "@/components/app-loader";
import { LoginPage } from "@/components/pages/login";
import { useAuth } from "@/query/auth";

export const Route = createFileRoute("/login")({
	component: WithRedirecLoginPage,
});

function WithRedirecLoginPage() {
	const { auth, isLoading } = useAuth();

	if (isLoading) return <AppLoader />;

	if (auth) return <Navigate to="/" />;

	return <LoginPage />;
}
