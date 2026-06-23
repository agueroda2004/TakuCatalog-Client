import { useAuth } from "@clerk/react";
import { ApiError } from "../utils/ApiError";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * A helper function to make API requests with proper headers and error handling.
 * @param path
 * @param options
 * @param token
 * @returns
 */
async function request<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 204) return undefined as unknown as T;

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw ApiError.fromResponse(error, res.status);
  }
  // console.log("Response from API:", await res.json());
  return res.json();
}

export function useApiClient() {
  const { getToken } = useAuth();

  return {
    get: async <T>(path: string) => {
      const token = await getToken();
      return request<T>(path, { method: "GET" }, token ?? undefined);
    },
    post: async <T>(path: string, body: unknown) => {
      const token = await getToken();
      return request<T>(
        path,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        token ?? undefined,
      );
    },
    patch: async <T>(path: string, body: unknown) => {
      const token = await getToken();
      return request<T>(
        path,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
        token ?? undefined,
      );
    },
    delete: async <T>(path: string) => {
      const token = await getToken();
      return request<T>(
        path,
        {
          method: "DELETE",
        },
        token ?? undefined,
      );
    },
  };
}
