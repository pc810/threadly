import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { UserProfilePostsFeed } from "@/components/post/feed";

export const Route = createFileRoute("/_app/user/$username/")({
	component: RouteComponent,
});

function RouteComponent() {
	const userDto = useLoaderData({ from: "/_app/user/$username" });

	return (
		<div>
			u/{userDto.name} 's Posts
			<UserProfilePostsFeed userId={userDto.id} />
		</div>
	);
}
