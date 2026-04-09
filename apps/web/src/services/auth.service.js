import { api } from "../lib/api";

export function getCurrentUser() {
  return api.get("/api/auth/me");
}

export function logout() {
  return api.post("/api/auth/logout");
}
