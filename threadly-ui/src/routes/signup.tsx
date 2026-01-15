import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLoader } from "@/components/app-loader";
import { SignUpPage } from "@/components/pages/signup";
import { useAuth } from "@/query/auth";

export const Route = createFileRoute("/signup")({
	component: WithRedirecLoginPage,
});

function WithRedirecLoginPage() {
	const { data: auth, isLoading } = useAuth();

	if (isLoading) return <AppLoader />;

	if (auth) return <Navigate to="/" />;

	return <SignUpPage />;
}
