import { InferSelectModel, schema } from "@mbsm/db-layer";
import { Authenticator } from "@mbsm/types";
import { getEnvAsBool, getEnvAsStr } from "@mbsm/utils";
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
  excludeCredentials,
}: {
  userID: string;
  userName: string;
  excludeCredentials?: Pick<Authenticator, "credentialId">[];
}) =>
  generateRegistrationOptions({
    authenticatorSelection: {
      userVerification: getEnvAsBool("IS_PROD") ? "required" : "discouraged",
    },
    rpName: getEnvAsStr("RP_NAME"),
    rpID: getEnvAsStr("RP_ID"),
    userID,
    userName,
    excludeCredentials: excludeCredentials?.map((a) => ({
      id: Buffer.from(a.credentialId, "base64url"),
      type: "public-key",
    })),
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
  authenticator: InferSelectModel<typeof schema.authenticator>;
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
