import { Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { addUtmParams } from "@/lib/format";
import type { UserDTO } from "@/types/user";

export const UserProfileWidget = ({ userDto }: { userDto: UserDTO }) => {
	const handleProfileShare = async () => {
		const shareData = {
			title: "Check this out",
			text: `${userDto.name}'s Profile`,
			url: addUtmParams(String(window.location.href), {
				utm_content: "share_button",
			}),
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error("Share failed:", err);
			}
		} else {
			await navigator.clipboard?.writeText(shareData.url);
			alert("Link copied to clipboard");
		}
	};

	return (
		<div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
			<div className="bg-linear-to-b from-primary to-85% to-card h-30"></div>

			<div className="px-4 pb-6 space-y-4">
				<div className="text-base font-bold">{userDto.name}</div>

				<Button onClick={handleProfileShare} variant="secondary" size="sm">
					<Share2Icon />
					Share
				</Button>
				<Separator />
				<ProfileStats />
				<Separator />
			</div>
		</div>
	);
};

const ProfileStats = () => (
	<div className="grid grid-cols-2 gap-4 text-sm">
		<div>
			<div className="font-medium">1</div>
			<div className="text-muted-foreground">Karma</div>
		</div>

		<div>
			<div className="font-medium">0</div>
			<div className="text-muted-foreground">Contributions</div>
		</div>

		<div>
			<div className="font-medium">2 m</div>
			<div className="text-muted-foreground">Threadly Age</div>
		</div>

		<div>
			<div className="font-medium">0</div>
			<div className="text-muted-foreground">Active in none</div>
		</div>
	</div>
);
