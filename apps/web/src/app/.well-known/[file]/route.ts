import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { file: string } }
): Promise<NextResponse> => {
  switch (params.file) {
    case "openid-configuration":
      return NextResponse.json({
        issuer: "https://select-sunbeam-deadly.ngrok-free.app",
        authorization_endpoint:
          "https://select-sunbeam-deadly.ngrok-free.app/authorize",
        token_endpoint: "https://select-sunbeam-deadly.ngrok-free.app/token",
        userinfo_endpoint:
          "https://select-sunbeam-deadly.ngrok-free.app/userinfo",
        jwks_uri:
          "https://select-sunbeam-deadly.ngrok-free.app/.well-known/jwks.json",
        response_types_supported: [
          "code",
          "token",
          "id_token",
          "code token",
          "code id_token",
          "token id_token",
          "code token id_token",
          "none",
        ],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
        scopes_supported: ["openid", "email", "profile"],
        token_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
        ],
        claims_supported: ["sub", "aud", "iss", "exp", "iat"],
      });

    case "jwks.json":
      return NextResponse.json({
        keys: [
          {
            kty: "RSA",
            n: "4iMNjJ8DiQN0_kTl9fgmyhYkSaRpEA7-QsbS8a5tI0ATb3n7toEoxma2dzK32-rqlO4u_bKCXdFoAHg5Xo9yCqb3ntPST30hYFLee57p9C8gWvPqHKhFBZcDOvyWDR7iwLTAw8VJo6AhPYn0vvafAGpX67a3Vl8HdrBYyreLpkiNKkzsINWDH58eZs9w_iaxd5uCoSrMuO6vkirg6Y4XtpRNCiYYG9G55n_2h18yUEB8Q0J7Rwn7UwSXgJjid7NX37wk4ZQzcKwmnLaMIL7F3IQhuKJbFn6959FTmO7drfnCxeuKCM3nN7WzY5zsdpltqXjzvI7uDomASL2hTtM_4w",
            e: "AQAB",
            ext: true,
            kid: "6a1ffae36adf2187cb70ae1f4a1",
            alg: "RS256",
            use: "sig",
          },
        ],
      });

    default:
      return new NextResponse(null, { status: 404 });
  }
};
