import { Link } from "@tanstack/react-router";
import { BellOff, Ellipsis, Plus } from "lucide-react";
import { InviteModButton } from "@/components/community/invite-mod-button";
import { JoinedModButton } from "@/components/community/join-mod-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getTwoCharacter } from "@/lib/format";
import { useCommunity } from "@/query/community";
import type { Community } from "@/types/community";

export const CommunityHeader = ({
	communityId,
}: {
	communityId: Community["id"];
}) => {
	const { data: community } = useCommunity(communityId);

	if (!community) return null;

	return (
		<div className="w-full md:w-280 mx-auto mb-4">
			<div className="h-18 bg-accent rounded-md my-2"></div>
			<div className="px-4 -mt-10 flex items-center gap-2">
				<Avatar className="size-22 border-4 border-background rounded-full">
					<AvatarImage src={"/"} alt={community.name} />
					<AvatarFallback className="rounded-lg">
						{getTwoCharacter(community.name)}
					</AvatarFallback>
				</Avatar>
				<div className="text-3xl font-bold self-end">r/{community.name}</div>

				<div className="ml-auto flex items-end gap-2 self-end">
					<InviteModButton communityId={community.id} />
					<Button variant="outline" className="rounded-full" size="lg" asChild>
						<Link
							to="/r/$communityName/submit"
							params={{ communityName: community.name }}
						>
							<Plus />
							Create Post
						</Link>
					</Button>
					<Button variant="outline" className="rounded-full" size="icon-lg">
						<BellOff />
					</Button>

					<JoinedModButton
						communityId={community.id}
						communityName={community.name}
					/>
					<Button variant="outline" className="rounded-full" size="icon-lg">
						<Ellipsis />
					</Button>
				</div>
			</div>
		</div>
	);
};
