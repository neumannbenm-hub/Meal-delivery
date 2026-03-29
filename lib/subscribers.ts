import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface Subscriber {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  subscribedAt: string;
  active: boolean;
  unsubscribeToken: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "subscribers.json");

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE))
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
}

export function getSubscribers(): Subscriber[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Subscriber[];
}

function saveSubscribers(subscribers: Subscriber[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

export function getActiveSubscribers(): Subscriber[] {
  return getSubscribers().filter((s) => s.active);
}

export function addSubscriber(data: {
  email?: string;
  phone?: string;
  name?: string;
}): Subscriber {
  const subscribers = getSubscribers();

  // Re-activate if already exists
  const existing = subscribers.find(
    (s) =>
      (data.email && s.email === data.email) ||
      (data.phone && s.phone === data.phone)
  );
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      saveSubscribers(subscribers);
    }
    return existing;
  }

  const subscriber: Subscriber = {
    id: randomUUID(),
    email: data.email ?? null,
    phone: data.phone ?? null,
    name: data.name ?? null,
    subscribedAt: new Date().toISOString(),
    active: true,
    unsubscribeToken: randomUUID(),
  };

  subscribers.push(subscriber);
  saveSubscribers(subscribers);
  return subscriber;
}

export function unsubscribeByToken(token: string): boolean {
  const subscribers = getSubscribers();
  const sub = subscribers.find((s) => s.unsubscribeToken === token);
  if (!sub || !sub.active) return false;
  sub.active = false;
  saveSubscribers(subscribers);
  return true;
}
