import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AchievementsAvatar = () => {
	return (
		<Avatar>
			<AvatarImage src="#" alt="@shadcn" />
			<AvatarFallback className="bg-primary">CN</AvatarFallback>
		</Avatar>
	);
};
