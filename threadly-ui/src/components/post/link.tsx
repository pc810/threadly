import { ExternalLink } from "@/components/external-link";
import { AppImageMedia } from "@/components/media/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePostLink } from "@/query/community";
import type { Post } from "@/types/post";

export const PostLinkDetail = ({ post }: { post: Post }) => {
	const { data, isLoading } = usePostLink(post.communityId, post.id);

	if (isLoading || data == null) return "Loading";

	const postlink = new URL(post.link);

	return (
		<>
			<ExternalLink href={post.link} className="block" utmId={post.id}>
				<Card className="gap-2 border-0 shadow-none pt-1 pb-2 bg-transparent">
					<CardHeader className="px-0">
						<CardTitle className="text-balance">{data.title}</CardTitle>
						<CardDescription className="line-clamp-3">
							{data.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="relative  aspect-video p-0 overflow-hidden rounded-xl">
						<AppImageMedia
							mediaId={data.mediaId}
							className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-100 scale-110"
						/>

						<div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/5 to-black/30" />

						<AppImageMedia
							mediaId={data.mediaId}
							className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-xl"
						/>
					</CardContent>
				</Card>
			</ExternalLink>
			<div className="border-t border-border pt-2 -mx-3 flex justify-between px-3 items-center">
				<div className="font-medium text-sm text-muted-foreground">
					{postlink.host}
				</div>
				<Button variant="outline" className="rounded-full" asChild>
					<ExternalLink
						href={post.link}
						className="flex gap-0.5 items-center"
						utmId={post.id}
					>
						Visit
					</ExternalLink>
				</Button>
			</div>
		</>
	);
};
