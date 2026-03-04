import clsx from "clsx";
import { useState } from "react";
import { PostCommentFeed } from "@/components/comment/feed";
import {
	AppCommunityLoadingUI,
	AppCommunityUserUI,
} from "@/components/community/avatar";
import { RichTextContent } from "@/components/rich-text-editor";
import { formatAgo } from "@/lib/date";
import { useUser } from "@/query/user";
import type { Community } from "@/types/community";
import type { Post } from "@/types/post";
import { CommentAddForm } from "../forms/comment-add";
import { Button } from "../ui/button";
import { PostCardActions } from "./card";
import { PostLinkDetail } from "./link";

type PostPageProps = {
	post: Post;
	community: Community;
};

export const PostPage = ({ post, community }: PostPageProps) => {
	const [commentFormVisible, setCommentFormVisible] = useState(false);

	const handleJoinConversation = () => {
		setCommentFormVisible(true);
	};

	const handleCancelConversation = () => {
		setCommentFormVisible(false);
	};

	return (
		<div className="space-y-4 my-6">
			<PostPageMeta post={post} community={community} />
			<PostPageTitle>{post.title}</PostPageTitle>
			<PostPageContent post={post} />

			{commentFormVisible ? (
				<CommentAddForm
					communityId={community.id}
					postId={post.id}
					parentId={null}
					depth={0}
					onCancel={handleCancelConversation}
					onSuccess={handleCancelConversation}
				/>
			) : (
				<Button
					onClick={handleJoinConversation}
					variant="outline"
					className="w-full rounded-full justify-start"
				>
					Join the conversation
				</Button>
			)}

			<PostCommentFeed
				commentId={null}
				communityId={community.id}
				postId={post.id}
			/>
		</div>
	);
};

const PostPageMeta = ({
	className,
	post,
	community,
	...props
}: React.ComponentProps<"div"> & {
	post: Post;
	community: Community;
}) => {
	const { data: user } = useUser(post.userId);

	return (
		<div
			className={clsx(
				"text-xs text-gray-500 flex items-center gap-1",
				className,
			)}
			{...props}
		>
			{!user ? (
				<AppCommunityLoadingUI />
			) : (
				<AppCommunityUserUI community={community} username={user.name}>
					<span>•</span>
					<time dateTime={post.createdAt}>{formatAgo(post.createdAt)}</time>
				</AppCommunityUserUI>
			)}

			<PostCardActions post={post} className="ml-auto  relative z-1" />
		</div>
	);
};

const PostPageTitle = ({ className, ...props }: React.ComponentProps<"h1">) => {
	return <h1 {...props} className={clsx("text-2xl", className)} />;
};
const PostPageContent = ({
	className,
	post,
	...props
}: React.ComponentProps<"div"> & { post: Post }) => {
	return (
		<div {...props}>
			{post.type === "TEXT" && <RichTextContent value={post.contentJson} />}
			{post.type === "LINK" && <PostLinkDetail post={post} />}
		</div>
	);
};
