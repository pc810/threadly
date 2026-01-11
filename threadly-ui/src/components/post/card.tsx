import clsx from "clsx";
import { CommunityCard } from "@/components/community/card";
import { PostLinkDetail } from "@/components/post/link";
import { RichTextPreview } from "@/components/rich-text-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAgo } from "@/lib/date";
import { usePost } from "@/query/community";
import type { Post } from "@/types/post";
import { AppCommunity } from "../community/avatar";

type PostIdProps = {
	postId: string;
	communityId: string;
};

type PostProps = {
	post: Post;
};

export const PostCard = ({ communityId, postId }: PostIdProps) => {
	const { data: post } = usePost(communityId, postId);

	//   return <PlaceholderCard />;
	if (!post) return <PlaceholderCard />;

	return (
		<PostCardRoot className="space-y-2">
			<PostCardMeta post={post} />
			<PostCardTitle>{post.title}</PostCardTitle>
			<PostCardContent post={post} />
		</PostCardRoot>
	);
};

const PostCardMeta = ({
	post,
	className,
	...props
}: React.ComponentProps<"p"> & PostProps) => {
	return (
		<div
			className={clsx(
				"text-xs text-gray-500 flex items-center gap-1",
				className,
			)}
			{...props}
		>
			<AppCommunity communityId={post.communityId} />
			<span>•</span>
			<time dateTime={post.createdAt}>{formatAgo(post.createdAt)}</time>
		</div>
	);
};

const PlaceholderCard = () => {
	return (
		<PostCardRoot className="space-y-4">
			<PostCardTitle>
				<Skeleton className="h-2 w-1/3" />
			</PostCardTitle>
			<div className="text-sm text-gray-500">
				<Skeleton className="h-2 w-1/2" />
			</div>
			<Skeleton className="h-2 w-full" />
			<Skeleton className="aspect-video w-full max-h-6" />
		</PostCardRoot>
	);
};

const PostCardRoot = ({ children, className }: React.ComponentProps<"div">) => {
	return (
		<div className={clsx("p-3 border rounded-xl", className)}>{children}</div>
	);
};
const PostCardTitle = ({ className, ...props }: React.ComponentProps<"h2">) => {
	return <h2 className={clsx("font-semibold text-lg", className)} {...props} />;
};
const PostCardContent = ({
	post,
	...props
}: React.ComponentProps<"div"> & PostProps) => {
	return (
		<div {...props}>
			{post.type === "TEXT" && <RichTextPreview value={post.contentText} />}
			{post.type === "LINK" && <PostLinkDetail post={post} />}
		</div>
	);
};
