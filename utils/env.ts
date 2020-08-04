require("dotenv").config();
import { mbsmEnv } from "./types";
import { env } from "process";
//@ts-ignore
export const environment = env as mbsmEnv;
