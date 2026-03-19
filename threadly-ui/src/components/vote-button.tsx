import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/query/auth";
import { useVote } from "@/query/community";

type VoteButtonProps = {
	communityId: string;
	commentId?: string;
	postId: string;
	initialVote?: number;
};

export function VoteButton({
	communityId,
	postId,
	commentId,
	initialVote = 0,
}: VoteButtonProps) {
	const [voteCount, setVoteCount] = useState(initialVote);

	const { auth } = useAuth();

	const { mutate: vote } = useVote(communityId, postId);

	const handleVote = (direction: 1 | -1) => {
		if ((!postId && !commentId) || !auth) return;

		vote({
			id: {
				postId: commentId != null ? postId : null,
				commentId: commentId ?? null,
				userId: auth.id,
			},
			direction,
		});

		setVoteCount((prev) => prev + direction);
	};

	return (
		<div className="flex gap-1 items-center">
			<Button size="icon-sm" variant="ghost" onClick={() => handleVote(1)}>
				<ChevronUp />
			</Button>
			<div>{voteCount ?? 0}</div>
			<Button size="icon-sm" variant="ghost" onClick={() => handleVote(-1)}>
				<ChevronDown />
			</Button>
		</div>
	);
}
