const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      "Request failed";

    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export const getOrganizations = () => api.get("/organizations");
export const createOrganization = (payload) => api.post("/organizations", payload);
export const updateOrganization = (id, payload) =>
  api.patch(`/organizations/${id}`, payload);
export const deleteOrganization = (id) => api.delete(`/organizations/${id}`);

export const getDomains = () => api.get("/domains");
export const createDomain = (payload) => api.post("/domains", payload);
export const deleteDomain = (id) => api.delete(`/domains/${id}`);

export const getMailboxes = () => api.get("/mailboxes");
export const createMailbox = (payload) => api.post("/mailboxes", payload);
export const deleteMailbox = (id) => api.delete(`/mailboxes/${id}`);

export const getUsers = () => api.get("/users");
export const inviteUser = (payload) => api.post("/users/invite", payload);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getActivityEvents = () => api.get("/activity-events");
export const getBootstrapStatus = () => api.get("/bootstrap/status");
export const getCurrentUser = () => api.get("/api/auth/me");
export const logout = () => api.post("/api/auth/logout");
