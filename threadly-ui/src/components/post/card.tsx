import clsx from "clsx";
import { EllipsisVertical } from "lucide-react";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppCommunity } from "@/components/community/avatar";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { formatAgo } from "@/lib/date";
import { kwId } from "@/lib/utils";
import { usePost, usePostRemove } from "@/query/community";
import { usePermission } from "@/query/permission";
import type { ShortcutKey } from "@/types/common";
import type { Post } from "@/types/post";
import { KeyboardShortcut } from "../keyboard-shortcut";

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
	hasPermission: boolean;
	shortcut: ShortcutKey[];
	variant?: DropdownMenuItemVariant;
};

export const PostCard = ({ communityId, postId }: PostIdProps) => {
	const { data: post } = usePost(communityId, postId);

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

type PostCardActionProps = React.ComponentProps<"div"> & PostProps;

export const PostCardActions = ({
	post,
	className,
	...props
}: PostCardActionProps) => {
	const { REMOVE: canRemove } = usePermission(
		"POST",
		post.id,
		["REMOVE"],
		"latency",
	);

	const removePostMutation = usePostRemove(post.communityId, post.id);

	const [menuOpen, setMenuOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const handleDelete = useCallback(() => {
		removePostMutation.mutate();
		setConfirmDeleteOpen(false);
	}, [removePostMutation]);

	useHotkeys(
		"delete",
		(event) => {
			event.preventDefault();
			setConfirmDeleteOpen(true);
		},
		{ enabled: menuOpen && canRemove },
	);

	const allActions: DropdownAction[] = [
		{
			label: "Delete",
			handler: () => setConfirmDeleteOpen(true),
			hasPermission: canRemove,
			shortcut: ["delete"],
			variant: "destructive",
			loading: removePostMutation.isPending,
		},
	];

	const actions = allActions.filter((a) => a.hasPermission);
	const loadingActions = removePostMutation.isPending;

	if (actions.length === 0) return null;

	return (
		<div className={clsx("text-primary-foreground", className)} {...props}>
			<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<EllipsisVertical />
						<span className="sr-only">Post actions</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56" align="start">
					<DropdownMenuLabel>Post Actions</DropdownMenuLabel>
					<DropdownMenuGroup>
						{actions.map((action, i) => (
							<DropdownMenuItem
								key={kwId(`action-${post.id}`, i)}
								variant={action.variant}
								onSelect={action.handler}
								disabled={loadingActions}
							>
								{action.loading && <Spinner />}
								{action.label}

								<KeyboardShortcut keys={action.shortcut} className="ml-auto" />
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteAlertDialog
				open={confirmDeleteOpen}
				onOpenChange={setConfirmDeleteOpen}
				description="Are you sure you want to delete this post? This action cannot be undone."
				onSuccess={handleDelete}
				loading={loadingActions}
			/>
		</div>
	);
};
