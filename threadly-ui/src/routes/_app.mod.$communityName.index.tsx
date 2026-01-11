import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mod/$communityName/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { communityName } = Route.useParams();
	return (
		<Navigate
			to="/mod/$communityName/moderators"
			replace
			params={{ communityName: communityName }}
		/>
	);
}
