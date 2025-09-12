import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const normalizeUrl = (base: string) => {
  if (!base) return "/api/trpc";
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${trimmed}/api/trpc`;
};

const getBaseUrl = (): string => {
  try {
    const env = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    if (env && typeof env === "string") {
      console.log("[trpc] Using env base url:", env);
      return env;
    }

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const origin = window.location.origin;
      console.log("[trpc] Using window origin base url:", origin);
      return origin;
    }

    const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoClient?.hostUri ?? null;
    if (hostUri) {
      const parts = hostUri.split(":");
      const hostname = parts[0];
      const port = parts[1] ? parts[1].split("/")[0] : "";
      const proto = "http";
      const url = port ? `${proto}://${hostname}:${port}` : `${proto}://${hostname}`;
      console.log("[trpc] Using hostUri-derived base url:", url);
      return url;
    }

    console.warn("[trpc] Falling back to localhost base url");
    return "http://localhost:3000";
  } catch (e) {
    console.error("[trpc] getBaseUrl error", e);
    return "";
  }
};

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpLink({
      url: normalizeUrl(getBaseUrl()),
    }),
  ],
});