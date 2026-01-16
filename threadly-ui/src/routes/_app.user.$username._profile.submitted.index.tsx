import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { UserProfilePostsFeed } from "@/components/post/feed";

export const Route = createFileRoute(
	"/_app/user/$username/_profile/submitted/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const userDto = useLoaderData({ from: "/_app/user/$username" });

	return <UserProfilePostsFeed userId={userDto.id} />;
}
