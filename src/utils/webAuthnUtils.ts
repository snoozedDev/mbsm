import * as schema from "@/db/schema";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { InferModel } from "drizzle-orm";
import { getEnvAsBool, getEnvAsStr } from "./envUtils";

export const getWebAuthnResponseForRegistration = ({
  attRes,
  expectedChallenge,
}: {
  attRes: RegistrationResponseJSON;
  expectedChallenge: string;
}) =>
  verifyRegistrationResponse({
    response: attRes,
    expectedChallenge,
    expectedOrigin: getEnvAsStr("ORIGIN"),
    expectedRPID: getEnvAsStr("RP_ID"),
    requireUserVerification: getEnvAsBool("IS_PROD"),
  });

export const getWebAuthnRegistrationOptions = ({
  userID,
  userName,
}: {
  userID: string;
  userName: string;
}) =>
  generateRegistrationOptions({
    rpName: getEnvAsStr("RP_NAME"),
    rpID: getEnvAsStr("RP_ID"),
    userID,
    userName,
  });

export const getWebAuthnLoginOptions = () =>
  generateAuthenticationOptions({
    userVerification: getEnvAsBool("IS_PROD") ? "required" : "discouraged",
  });

export const getWebAuthnResponseForAuthentication = ({
  attRes,
  authenticator,
}: {
  attRes: AuthenticationResponseJSON;
  authenticator: InferModel<typeof schema.authenticator>;
}) =>
  verifyAuthenticationResponse({
    response: attRes,
    expectedChallenge: () => true, // allow any challenge
    expectedOrigin: getEnvAsStr("ORIGIN"),
    expectedRPID: getEnvAsStr("RP_ID"),
    requireUserVerification: getEnvAsBool("IS_PROD"),
    authenticator: {
      counter: Number(authenticator.counter),
      credentialID: Buffer.from(authenticator.credentialId, "base64url"),
      credentialPublicKey: Buffer.from(
        authenticator.credentialPublicKey,
        "base64url"
      ),
    },
  });
