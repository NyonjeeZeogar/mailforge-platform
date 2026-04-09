import React, { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext(null);

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

async function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

async function logoutRequest() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries();
    },
  });

  const value = useMemo(() => {
    const user = meQuery.data ?? null;

    return {
      user,
      isAuthenticated: !!user,
      isLoadingAuth: meQuery.isLoading,
      authError: meQuery.error ?? null,
      checkAppState: meQuery.refetch,
      logout: logoutMutation.mutateAsync,
    };
  }, [meQuery, logoutMutation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
