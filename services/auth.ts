"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib/lib";
import { login_api, signup_api } from "@/public/data";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getAuth = async () => {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoged) {
    session.isLoged = defaultSession.isLoged;
  }
  return session;
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getAuth();
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;

  const signing = await fetch(`${login_api}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formEmail,
      password: formPassword,
    }),
  })
    .then((data) => data.json())
    .catch((err) => {
      console.log(err);
    });
  if (signing.status === "success") {
    let userData = await signing?.data?.user;
    session.token = signing.token;
    session.username = userData.username;
    session.avatar = userData.avatar;
    session.role = userData.role;
    session.tags = userData.tags;
    session.wishlist = userData.wishlist;
    session.id = userData.id;
    session.isLoged = true;
    session.expiresAt = 2592000000;
    console.log(session);
    await session.save();
    return "success";
  } else {
    return signing.message;
  }
};

export const signup = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getAuth();
  const formUsername = formData.get("username") as string;
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;

  const signing = await fetch(`${signup_api}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formUsername,
      email: formEmail,
      password: formPassword,
    }),
  })
    .then((data) => data.json())
    .catch((err) => {
      console.log(err);
    });
  if (signing.status === "success") {
    let userData = await signing?.data?.user;
    session.token = signing.token;
    session.username = userData.username;
    session.avatar = userData.avatar;
    session.role = userData.role;
    session.tags = userData.tags;
    session.wishlist = userData.wishlist;
    session.id = userData.id;
    session.isLoged = true;
    session.expiresAt = 2592000000;
    console.log(session);
    await session.save();
    return "success";
  } else {
    return signing.message;
  }
};

export const logout = async () => {
  const session = await getAuth();
  session.destroy();
};


//
//



export const get = async (api, queries = '') => {
  const session = await getAuth();
  const docs = await fetch(`${api}?${queries}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${session.token}`,
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  return docs;
};

export const post = async (api, body) => {
  const session = await getAuth();
  const res = await fetch(`${api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ ...body }),
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));

  return res;
};

export const patch = async (api, body) => {
  const session = await getAuth();
  const res = await fetch(`${api}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ body }),
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));

  return res;
};

export const del = async (api) => {
  const session = await getAuth();
  const res = await fetch(`${api}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${session.token}`,
    },
  })
    .then((data) => data?.json())
    .catch((err) => console.log(err));

  return res;
};
