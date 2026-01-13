import clsx from "clsx";
import { EllipsisVertical } from "lucide-react";
import { useCallback, useEffect } from "react";
import { AppCommunity } from "@/components/community/avatar";
import { PostLinkDetail } from "@/components/post/link";
import { RichTextPreview } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	type DropdownMenuItemVariant,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { formatAgo } from "@/lib/date";
import { usePost, usePostRemove } from "@/query/community";
import { usePermission } from "@/query/permission";
import type { Post } from "@/types/post";

type PostIdProps = {
	postId: string;
	communityId: string;
};

type PostProps = {
	post: Post;
};

type DropdownAction = {
	label: string;
	loading?: boolean;
	handler: () => void;
	hasPermisson: boolean;
	shortcut: string;
	variant?: DropdownMenuItemVariant;
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

			<PostCardActions post={post} className="ml-auto" />
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

export const PostCardActions = ({
	post,

	className,
	...props
}: React.ComponentProps<"div"> & PostProps) => {
	const {
		UPDATE: canUpdate,
		REMOVE: canRemove,
		isLoading,
	} = usePermission("POST", post.id, ["UPDATE", "REMOVE"], "latency");

	const removePostMutation = usePostRemove(post.communityId, post.id);

	const handleEdit = useCallback(() => {
		console.log("edit", post.id);
	}, [post.id]);

	const handleDelete = useCallback(() => {
		console.log("delete", post.id);
		removePostMutation.mutate();
	}, [post.id, removePostMutation.mutate]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const isCmdOrCtrl = e.metaKey || e.ctrlKey;

			if (!isCmdOrCtrl) return;

			if (e.key.toLowerCase() === "e") {
				e.preventDefault();
				handleEdit();
			}

			if (e.key.toLowerCase() === "d") {
				e.preventDefault();
				handleDelete();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [handleEdit, handleDelete]);

	const allActions: DropdownAction[] = [
		{
			label: "Edit",
			handler: handleEdit,
			hasPermisson: canUpdate,
			shortcut: "⌘E",
		},
		{
			label: "Delete",
			handler: handleDelete,
			hasPermisson: canRemove,
			shortcut: "⌘D",
			variant: "destructive",
			loading: removePostMutation.isPending,
		},
	];

	const actions = allActions.filter((a) => a.hasPermisson);

	const loadingActions = removePostMutation.isPending;

	if (actions.length === 0) return null;

	return (
		<div className={clsx("text-primary-foreground", className)} {...props}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<EllipsisVertical />
						<span className="sr-only">Post actions</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56" align="start">
					<DropdownMenuLabel>Post Actions</DropdownMenuLabel>

					<DropdownMenuGroup>
						{actions.map((action) => (
							<DropdownMenuItem
								variant={action.variant}
								onSelect={action.handler}
								key={action.shortcut}
								disabled={loadingActions}
							>
								{action.loading && <Spinner />}
								{action.label}
								<DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
