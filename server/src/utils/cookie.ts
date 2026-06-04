import { Response, CookieOptions } from "express";

const sendCookie = (res: Response, name: string, value: string,maxAge: number) => {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge,
  }
    res.cookie(name, value, defaultOptions);
};

const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export { sendCookie, clearCookie };