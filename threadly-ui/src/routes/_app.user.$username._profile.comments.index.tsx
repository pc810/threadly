import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/user/$username/_profile/comments/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	return <div>Hello "/_app/user/$username/_profile/fallback/"!</div>;
}
