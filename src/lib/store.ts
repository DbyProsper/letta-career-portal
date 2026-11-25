"use client";
import { useSyncExternalStore } from "react";
const prefix = "letta-demo-v1:";
const localEvent = "letta-demo-update";
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener(localEvent, fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener(localEvent, fn);
  };
}
export function useLocal<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((old: T) => T)) => void] {
  const read = () => {
    try {
      return localStorage.getItem(prefix + key);
    } catch {
      return null;
    }
  };
  const raw = useSyncExternalStore(subscribe, read, () => null);
  function parse(raw: string | null): T {
    try {
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  const update = (next: T | ((old: T) => T)) => {
    const value =
      typeof next === "function"
        ? (next as (old: T) => T)(parse(read()))
        : next;
    localStorage.setItem(prefix + key, JSON.stringify(value));
    window.dispatchEvent(new Event(localEvent));
  };
  return [parse(raw), update];
}
export type Booking = {
  id: string;
  service: string;
  practitioner: string;
  slot: string;
  name: string;
  format: string;
  status: string;
};
export type Enquiry = {
  id: string;
  role: string;
  organisation: string;
  programme: string;
  status: string;
};
export type Article = {
  image?: string;
  id: string;
  title: string;
  body: string;
  category: string;
  language: string;
  published: boolean;
};
export type Goal = {
  id: string;
  title: string;
  milestones: { id: string; title: string; done: boolean }[];
};
export const toggle = (items: string[], item: string) =>
  items.includes(item) ? items.filter((x) => x !== item) : [...items, item];
