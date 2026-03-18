import { SessionOptions } from "iron-session";

export interface SessionData {
  isLoged: boolean;
  token?: string;
}

export const defaultSession: SessionData = {
  isLoged: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "auth-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
