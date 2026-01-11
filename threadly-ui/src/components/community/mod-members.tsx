import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsLineList, TabsLineTrigger } from "@/components/ui/tabs";

interface CommunityMembersTabsProps {
	defaultValue: string;
	communityName: string;
	className?: string;
}

export function CommunityMembersTabs({
	defaultValue,
	communityName,
	className,
}: CommunityMembersTabsProps) {
	const [value, setValue] = useState(defaultValue);

	const navigate = useNavigate();

	const handleValueChange = (nextPath: string) => {
		setValue(nextPath);
		if (nextPath === "moderators")
			navigate({
				to: "/mod/$communityName/moderators",
				params: { communityName },
			});
		else if (nextPath === "approved-users")
			navigate({
				to: "/mod/$communityName/approved-users",
				params: { communityName },
			});
		else
			navigate({
				to: "/mod/$communityName/invites",
				params: { communityName },
			});
	};
	return (
		<Tabs
			defaultValue="moderators"
			className={className}
			value={value}
			onValueChange={handleValueChange}
		>
			<TabsLineList className="border-b-0">
				<TabsLineTrigger value="moderators">Moderators</TabsLineTrigger>
				<TabsLineTrigger value="approved-users">Approved Users</TabsLineTrigger>
				<TabsLineTrigger value="invites">Invites</TabsLineTrigger>
			</TabsLineList>
		</Tabs>
	);
}
