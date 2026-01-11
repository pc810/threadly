import { format } from "date-fns";
import { Cake, EyeOff, Globe, type LucideIcon } from "lucide-react";
import { type ReactNode, useId } from "react";
import { capitalizeWord } from "@/lib/format";
import { kwId } from "@/lib/utils";
import { type Community, CommunityVisibility } from "@/types/community";

type CommunityStat = {
	Icon: LucideIcon;
	children: ReactNode;
};

export const CommunityStatsList = ({ community }: { community: Community }) => {
	const baseId = useId();

	const stats: CommunityStat[] = [
		{
			Icon: Cake,
			children: <>Created {format(community.createdAt, "MMM dd, yyyy")}</>,
		},
		{
			Icon:
				community.visibility === CommunityVisibility.PRIVATE ? EyeOff : Globe,
			children: capitalizeWord(`${community.visibility}`),
		},
	];

	return (
		<ul className="space-y-2">
			{stats.map(({ Icon, children }, idx) => (
				<li
					key={kwId(baseId, idx)}
					className="flex items-center gap-2 text-xs text-muted-foreground"
				>
					<Icon size={16} />
					{children}
				</li>
			))}
		</ul>
	);
};
