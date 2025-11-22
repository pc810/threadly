import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./utils";
import { axios } from "@/lib/axios";
import {
  LoginRequest,
  RegisterUserRequest,
  UserDTO,
  userDTOSchema,
} from "@/types";

import { toast } from "sonner";

export const useAuth = () => {
  return useQuery({
    queryKey: [QueryKeys.auth],
    queryFn: async () =>
      axios
        .get<UserDTO>("/auth/me")
        .then((d) => userDTOSchema.parse(d.data))
        .catch(() => null),
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterUserRequest) => {
      const response = await axios.post("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      toast("User Register successfully 🎉", {
        description: "Your profile has been created.",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.auth] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to register user. Please try again.";
      toast.error("Error registering user", {
        description: message,
      });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const res = await axios.post("/auth/login", payload);
      return res.data;
    },
    onSuccess: () => {
      toast("Login successful 🎉", {
        description: "Welcome back!",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.auth] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to login. Please try again.";
      toast.error("Login failed ❌", { description: message });
    },
  });
};
