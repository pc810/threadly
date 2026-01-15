import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { PostAddForm } from "@/components/forms/post-add";
import { AppLayout, AppPageTitle } from "@/components/layout/app-layout";

export const Route = createFileRoute("/_app/r/$communityName/submit")({
	component: RouteComponent,
});

function RouteComponent() {
	const community = useLoaderData({ from: "/_app/r/$communityName" });

	return (
		<AppLayout>
			<div className="w-1/2 mx-auto">
				<AppPageTitle>Create Post</AppPageTitle>
				<PostAddForm communityId={community.id} />
			</div>
		</AppLayout>
	);
}
