import {
	type CommunityRole,
	CommunityTopic,
	CommunityVisibility,
} from "@/types/community";

export const CommunityRoleLabel: Record<CommunityRole, string> = {
	PUBLIC: "Public",
	AUTHOR: "Owner",
	MEMBER: "Member",
	MOD: "Moderator",
};

export const COMMUNITY_TOPICS: Record<
	CommunityTopic,
	{ icon: string; label: string; value: CommunityTopic }
> = {
	ART: {
		icon: "🧑‍🎨",
		label: "Art",
		value: CommunityTopic.ART,
	},
	BUSINESS_FINANCE: {
		icon: "💵",
		label: "Business & Finance",
		value: CommunityTopic.BUSINESS_FINANCE,
	},
	COLLECTIBLES: {
		icon: "🧩",
		label: "Collectibles & Other Hobbies",
		value: CommunityTopic.COLLECTIBLES,
	},
	EDUCATION_CAREER: {
		icon: "🧑‍🏫",
		label: "Education & Career",
		value: CommunityTopic.EDUCATION_CAREER,
	},
	FASHION_BEAUTY: {
		icon: "🪞",
		label: "Fashion & Beauty",
		value: CommunityTopic.FASHION_BEAUTY,
	},
	FOOD_DRINKS: {
		icon: "🍔",
		label: "Food & Drinks",
		value: CommunityTopic.FOOD_DRINKS,
	},
	GAMES: {
		icon: "🕹️",
		label: "Games",
		value: CommunityTopic.GAMES,
	},
	HEALTH: {
		icon: "❤️‍🩹",
		label: "Health",
		value: CommunityTopic.HEALTH,
	},
	HOME_GARDEN: {
		icon: "🏡",
		label: "Home & Garden",
		value: CommunityTopic.HOME_GARDEN,
	},
	HUMANITIES_LAW: {
		icon: "📜",
		label: "Humanities & Law",
		value: CommunityTopic.HUMANITIES_LAW,
	},
	IDENTITY_RELATIONSHIPS: {
		icon: "🌈",
		label: "Identity & Relationships",
		value: CommunityTopic.IDENTITY_RELATIONSHIPS,
	},
	INTERNET_CULTURE: {
		icon: "🙉",
		label: "Internet Culture",
		value: CommunityTopic.INTERNET_CULTURE,
	},
	MOVIES_TV: {
		icon: "🎞️",
		label: "Movies & TV",
		value: CommunityTopic.MOVIES_TV,
	},
	MUSIC: {
		icon: "🎶",
		label: "Music",
		value: CommunityTopic.MUSIC,
	},
	NATURE_OUTDOORS: {
		icon: "🌿",
		label: "Nature & Outdoors",
		value: CommunityTopic.NATURE_OUTDOORS,
	},
	NEWS_POLITICS: {
		icon: "📰",
		label: "News & Politics",
		value: CommunityTopic.NEWS_POLITICS,
	},
	PLACES_TRAVEL: {
		icon: "🌐",
		label: "Places & Travel",
		value: CommunityTopic.PLACES_TRAVEL,
	},
	POP_CULTURE: {
		icon: "✨",
		label: "Pop Culture",
		value: CommunityTopic.POP_CULTURE,
	},
	QAS_STORIES: {
		icon: "✏️",
		label: "Q&As & Stories",
		value: CommunityTopic.QAS_STORIES,
	},
	READING_WRITING: {
		icon: "📖",
		label: "Reading & Writing",
		value: CommunityTopic.READING_WRITING,
	},
	SCIENCES: {
		icon: "🧪",
		label: "Sciences",
		value: CommunityTopic.SCIENCES,
	},
	SPOOKY: {
		icon: "💀",
		label: "Spooky",
		value: CommunityTopic.SPOOKY,
	},
	SPORTS: {
		icon: "🏅",
		label: "Sports",
		value: CommunityTopic.SPORTS,
	},
	TECHNOLOGY: {
		icon: "🛰️",
		label: "Technology",
		value: CommunityTopic.TECHNOLOGY,
	},
	VEHICLES: {
		icon: "🚗",
		label: "Vehicles",
		value: CommunityTopic.VEHICLES,
	},
	WELLNESS: {
		icon: "🧘",
		label: "Wellness",
		value: CommunityTopic.WELLNESS,
	},
	// MATURE_TOPICS: {
	// 	icon: "🔞",
	// 	label: "Mature Topics",
	// 	value: CommunityTopic.MATURE_TOPICS,
	// },
} as const;

export const COMMUNITY_VISIBILITY = [
	{ label: "Public", value: CommunityVisibility.PUBLIC },
	{ label: "Private", value: CommunityVisibility.PRIVATE },
];
