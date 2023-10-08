import { getEnvAsStr } from "@mbsm/utils";
import { Resend } from "resend";

export const resend = new Resend(getEnvAsStr("RESEND_API_KEY"));
