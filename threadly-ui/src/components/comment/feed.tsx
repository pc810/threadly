import type {
	InfiniteData,
	UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePostComment } from "@/query/community";
import type { CommentDTO, CommentDTOSlice } from "@/types/comment";
import { CommentAddForm } from "../forms/comment-add";
import { RichTextContent } from "../rich-text-editor";
import { AppUser } from "../user/avatar";

type CommentFeedProviderProps = {
	query: UseInfiniteQueryResult<InfiniteData<CommentDTOSlice>>;
	childCount?: number;
};
export function CommentFeedProvider({
	query,
	childCount,
}: CommentFeedProviderProps) {
	const {
		data: feed,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
		hasNextPage,
	} = query;

	const comments = feed?.pages.flatMap((page) => page.content) ?? [];

	if (comments == null || isLoading) return <p>Loading...</p>;

	if (comments.length === 0) return <PlaceHolderCommentFeed />;

	const commentCount = (childCount ?? 0) - comments.length;

	return (
		<div className="space-y-4">
			{comments.map((comment) => (
				<CommendCard comment={comment} key={comment.id} />
			))}

			{hasNextPage && (
				<Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
					{isFetchingNextPage && <Spinner />}
					Load more {commentCount > 0 && <>({commentCount})</>}
				</Button>
			)}
		</div>
	);
}

const PlaceHolderCommentFeed = () => {
	return (
		<div className="gap-2 flex-col flex mx-auto max-w-lg text-center items-center py-30">
			<h1 className="text-2xl font-bold">No comments available</h1>
		</div>
	);
};

const CommendCard = ({ comment }: { comment: CommentDTO }) => {
	const [reply, setReply] = useState(false);

	const handleCloseForm = useCallback(() => {
		setReply(false);
	}, []);

	return (
		<div>
			<div className="grid grid-cols-[2rem_1fr]">
				<div className="h-8">
					<AppUser
						userId={comment.userId}
						size="md"
						hasName
						className="gap-2"
						isFormated={false}
					/>
				</div>
			</div>
			<div className="grid grid-cols-[2rem_1fr]">
				<div>
					<div className="w-px h-full bg-border mx-auto"></div>
				</div>
				<div className="px-2">
					<RichTextContent value={comment.contentJson} />
				</div>
			</div>
			<div className="grid grid-cols-[2rem_1fr]">
				<div>
					<div className="w-px h-full bg-border mx-auto"></div>
				</div>
				<div className="px-2 flex gap-1">
					<div className="flex gap-1">
						<Button size="icon-sm" variant="ghost">
							<ChevronUp />
						</Button>
						<div>0</div>
						<Button size="icon-sm" variant="ghost">
							<ChevronDown />
						</Button>
					</div>
					<Button onClick={() => setReply(true)} size="sm" variant="ghost">
						<MessageCircle /> Reply
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-[2rem_1fr]">
				<div>
					<div className="w-px h-full bg-border mx-auto"></div>
				</div>
				<div className="px-2">
					{reply && (
						<CommentAddForm
							communityId={comment.communityId}
							parentId={comment.id}
							postId={comment.postId}
							depth={comment.depth + 1}
							onCancel={handleCloseForm}
							onSuccess={handleCloseForm}
						/>
					)}
					{comment.childCount > 0 && (
						<PostCommentFeed
							commentId={comment.id}
							communityId={comment.communityId}
							postId={comment.postId}
							childCount={comment.childCount}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export function PostCommentFeed({
	communityId,
	postId,
	commentId,
	childCount,
}: {
	communityId: string;
	postId: string;
	commentId: string | null;
	childCount?: number;
}) {
	const query = usePostComment(communityId, postId, commentId);
	return <CommentFeedProvider query={query} childCount={childCount} />;
}
