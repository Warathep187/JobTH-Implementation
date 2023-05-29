import { getCookie, setCookie, removeCookies } from "cookies-next";

export const getStoredCookie = (key) => {
  return getCookie(key);
};

export const setNewCookie = (key, value) => {
  setCookie(key, value);
};

export const removeStoredCookie = (key) => {
  removeCookies(key);
};