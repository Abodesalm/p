import { SessionOptions } from "iron-session";

export interface SessionData {
  token?: string;
  username?: string;
  avatar?: number;
  role?: string;
  tags?: string[];
  wishlist?: string[];
  id?: string;
  isLoged: boolean;
  expiresAt?: number;
}

export const defaultSession: SessionData = {
  isLoged: false,
};

export const sessionOptions: SessionOptions = {
  password: "iawyfa7821931gff1h87gef187eh8wsd1wushksjf1ij1is9",
  cookieName: "auth-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
