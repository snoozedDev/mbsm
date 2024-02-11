export const getCookiesFromReq = (req: Request) => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return {};
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  return Object.fromEntries(
    cookies.map((cookie) => cookie.split("="))
  ) as Record<string, string>;
};

export const getHeadersFromReq = (req: Request) => {
  const headers = req.headers;
  return {
    get: (header: string) => headers.get(header),
  };
};

export type CookieOptions = {
  name: string;
  value: string;
  maxAge: number;
  path: string;
  httpOnly: boolean;
  secure: boolean;
};

export const setCookie = (
  resHeaders: Headers,
  { httpOnly, maxAge, name, path, secure, value }: CookieOptions
) => {
  let cookie = `${name}=${value};`;
  if (maxAge) cookie += `Max-Age=${maxAge};`;
  if (path) cookie += `Path=${path};`;
  if (httpOnly) cookie += `HttpOnly;`;
  if (secure) cookie += `Secure;`;
  resHeaders.append("Set-Cookie", cookie);
};
