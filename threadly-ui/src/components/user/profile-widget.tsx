import { useAtomValue } from "jotai";
import { Eye, Share2Icon, Shirt } from "lucide-react";
import { isSelfProfileAtom } from "@/atoms/profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { addUtmParams } from "@/lib/format";
import { cn, kwId } from "@/lib/utils";
import { useAuth } from "@/query/auth";
import type { UserDTO } from "@/types/user";
import { AchievementsAvatar } from "../achievements/avatar";
import { AppUserAvatar } from "./avatar";

export const UserProfileWidget = ({ userDto }: { userDto: UserDTO }) => {
	const isSelfProfile = useAtomValue(isSelfProfileAtom);

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
		<div className="bg-card text-card-foreground rounded-xl border shadow-sm">
			<div className="bg-linear-to-b from-primary to-85% to-card h-30 rounded-xl"></div>

			<div className="px-4 pb-6 space-y-4">
				<div className="text-base font-bold">{userDto.name}</div>
				{!isSelfProfile && (
					<Button onClick={handleProfileShare} variant="secondary" size="sm">
						<Share2Icon />
						Share
					</Button>
				)}

				<Separator />
				<ProfileStats />
				<Achievements />

				{isSelfProfile && (
					<>
						<Separator />
						<Settings />
					</>
				)}

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

const Achievements = () => {
	return (
		<WidgetCard>
			<WidgetTitle>Achievement</WidgetTitle>
			<div className="flex text-xs gap-4">
				<div>
					<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
						<AchievementsAvatar />
						<AchievementsAvatar />
						<AchievementsAvatar />
					</div>
				</div>
				Banana Beginner Banana Enthusiast, Banana Baby, Banana Beginner, +4 more
			</div>
			<div className="flex justify-between">
				<div className="text-xs">7 unlocked</div>
				<Button variant="secondary" size="xs">
					View All
				</Button>
			</div>
		</WidgetCard>
	);
};

const Settings = () => {
	const { auth } = useAuth();

	if (!auth) return null;

	const actions = [
		{
			title: "Profile",
			content: "Customize your profile",
			icon: <AppUserAvatar userId={auth.id} size="md" />,
		},
		{
			title: "Curate your profile",
			content: "Manage what people see when they visit your profile",
			icon: <Eye className="size-5" />,
		},
		{
			title: "Avatar",
			content: "Style your avatar",
			icon: <Shirt className="size-5" />,
		},
	];

	return (
		<WidgetCard>
			<WidgetTitle>Settings</WidgetTitle>

			{actions.map((card, i) => (
				<div
					className="flex gap-2 items-center"
					key={kwId(`action${card.title}`, i)}
				>
					<div className="size-8 flex items-center justify-center shrink-0">
						{card.icon}
					</div>
					<div className="flex flex-col text-sm">
						<div>{card.title}</div>
						<div className="text-muted-foreground text-xs">{card.content}</div>
					</div>
					<Button variant="secondary" size="xs" className="ml-auto">
						Update
					</Button>
				</div>
			))}
		</WidgetCard>
	);
};

const WidgetTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div
		className={cn(
			"uppercase text-muted-foreground text-xs font-semibold",
			className,
		)}
		{...props}
	></div>
);

const WidgetCard = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div className={cn("space-y-3", className)} {...props}></div>
);
