import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import type { LoginRequest, RegisterUserRequest } from "@/types/auth";
import { userDTOSchema } from "@/types/user";
import type { AppAxoisError } from "@/types/utils";
import { queryKeys } from "./keys";

export const getAuthMe = async () =>
	axios
		.get("/auth/me")
		.then(({ data }) => userDTOSchema.parse(data))
		.catch(async () => {
			try {
				await axios.post("/auth/logout");
			} catch (logoutError) {
				console.error("Logout failed:", logoutError);
			}
			return null;
		});

export const useAuth = () => {
	const queryClient = useQueryClient();

	const { data: auth, isLoading } = useQuery({
		queryKey: queryKeys.auth.me(),
		queryFn: getAuthMe,
	});

	const { mutateAsync: signOut } = useMutation({
		mutationFn: () => axios.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.auth.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.community.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.permission.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.media.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.feed.all,
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.user.all,
			});
		},
	});

	return {
		isLoading,
		isLogedIn: !!auth,
		auth: auth ?? null,
		signOut,
	};
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.auth.login(),
		mutationFn: async (payload: LoginRequest) =>
			axios.post("/auth/login", payload),
		onSuccess: () => {
			toast("Login successful", {
				description: "Welcome back!",
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
		},
		onError: (error: AppAxoisError) => {
			const message =
				error?.response?.data?.message || "Failed to login. Please try again.";
			toast.error("Login failed !", { description: message });
		},
	});
};

export const useSignup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: RegisterUserRequest) =>
			axios.post("/auth/register", data),
		onSuccess: () => {
			toast("User Register successfully", {
				description: "Your profile has been created.",
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
		},
		onError: (error: AppAxoisError) => {
			const message =
				error.response?.data?.message ||
				"Failed to register user. Please try again.";
			toast.error("Error registering user", {
				description: message,
			});
		},
	});
};
