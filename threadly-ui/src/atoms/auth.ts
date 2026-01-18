import { atom } from "jotai";
import type { tokenDTO } from "@/types/auth";

export const tokenAtom = atom<tokenDTO | null>(null);
