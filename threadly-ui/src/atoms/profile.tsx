import { atom } from "jotai";
import type { UserDTO, UserMetaDTO } from "@/types/user";

export const authAtom = atom<UserMetaDTO | null>(null);
export const userDtoAtom = atom<UserDTO | null>(null);

export const isSelfProfileAtom = atom((get) => {
	const auth = get(authAtom);
	const user = get(userDtoAtom);
	return auth?.id === user?.id;
});
