import { Redis as Upstash } from "@upstash/redis";

export const redis = Upstash.fromEnv();
