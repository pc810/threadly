import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/user/$username/")({
	component: RouteComponent,
});

function RouteComponent() {
	const userDto = useLoaderData({ from: "/_app/user/$username" });

	return (
		<div>
			Hello "/_app/user/$userName/"!
			<pre>{JSON.stringify(userDto, null, 2)}</pre>
		</div>
	);
}
