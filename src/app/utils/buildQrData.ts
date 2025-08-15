export type QrType = "url" | "text" | "vcard" | "wifi" | "email" | "sms" | "upi";

export type QrPayload =
  | { type: "url"; url: string }
  | { type: "text"; text: string }
  | {
      type: "vcard";
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      org?: string;
      title?: string;
      url?: string;
    }
  | { type: "wifi"; ssid: string; password?: string; encryption?: "WEP" | "WPA" | "nopass"; hidden?: boolean }
  | { type: "email"; to: string; subject?: string; body?: string }
  | { type: "sms"; to: string; body?: string }
  | { type: "upi"; pa: string; pn?: string; am?: string; cu?: string };


export function validateQrPayload(p: QrPayload): string[] {
  const errs: string[] = [];
  switch (p.type) {
    case "url": {
      const u = p.url?.trim();
      if (!u) errs.push("URL is required.");
      if (u && !/^https?:\/\//i.test(u)) errs.push("Consider adding http(s):// for best compatibility.");
      break;
    }
    case "wifi": {
      if (!p.ssid?.trim()) errs.push("Wi-Fi SSID is required.");
      if ((p.encryption === "WEP" || p.encryption === "WPA") && !p.password?.trim()) {
        errs.push("Password required for WEP/WPA.");
      }
      break;
    }
    case "email": {
      if (!p.to?.trim()) errs.push("Email recipient is required.");
      break;
    }
    case "sms": {
      if (!p.to?.trim()) errs.push("SMS phone number is required.");
      break;
    }
    case "upi": {
      if (!p.pa?.trim()) errs.push("UPI ID (pa) is required.");
      break;
    }
    default:
      break;
  }
  return errs;
}


export function buildQrData(type: QrType, payload: QrPayload): string {
  switch (payload.type) {
    case "url":
      return buildUrl(payload.url);
    case "text":
      return payload.text ?? "";
    case "vcard":
      return buildVCard(payload);
    case "wifi":
      return buildWiFi(payload);
    case "email":
      return buildMailto(payload);
    case "sms":
      return buildSms(payload);
    case "upi":
      return buildUpi(payload);
    default:
      return "";
  }
}

/* -------------------- Builders -------------------- */

function buildUrl(url: string): string {
  return (url || "").trim();
}

function buildVCard(p: Extract<QrPayload, { type: "vcard" }>): string {
  const first = (p.firstName ?? "").trim();
  const last = (p.lastName ?? "").trim();
  const org = (p.org ?? "").trim();
  const title = (p.title ?? "").trim();
  const phone = (p.phone ?? "").trim();
  const email = (p.email ?? "").trim();
  const url = (p.url ?? "").trim();

  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

  const fullName = [first, last].filter(Boolean).join(" ").trim();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(last)};${escape(first)};;;`,
    fullName ? `FN:${escape(fullName)}` : "",
    org ? `ORG:${escape(org)}` : "",
    title ? `TITLE:${escape(title)}` : "",
    phone ? `TEL;TYPE=CELL,VOICE:${escape(phone)}` : "",
    email ? `EMAIL;TYPE=INTERNET:${escape(email)}` : "",
    url ? `URL:${escape(url)}` : "",
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\r\n");
}

function buildWiFi(p: Extract<QrPayload, { type: "wifi" }>): string {
  const enc = p.encryption && p.encryption !== "nopass" ? p.encryption : "nopass";
  const esc = (s?: string) => (s ? s.replace(/([\\;,:"])/g, "\\$1") : "");
  return [
    `WIFI:T:${enc};S:${esc(p.ssid)};`,
    p.password ? `P:${esc(p.password)};` : "",
    p.hidden ? "H:true;" : "",
    ";",
  ].join("");
}

function buildMailto(p: Extract<QrPayload, { type: "email" }>): string {
  const to = (p.to ?? "").trim();
  const qs = new URLSearchParams();
  if (p.subject) qs.set("subject", p.subject);
  if (p.body) qs.set("body", p.body);
  const query = qs.toString();
  return `mailto:${encodeRFC3986Mailto(to)}${query ? `?${query}` : ""}`;
}

function buildSms(p: Extract<QrPayload, { type: "sms" }>): string {
  const to = (p.to ?? "").trim();
  const body = (p.body ?? "").trim();
  return `SMSTO:${to}:${body}`;
}

function buildUpi(p: Extract<QrPayload, { type: "upi" }>): string {
  const params = new URLSearchParams();
  params.set("pa", p.pa.trim());
  if (p.pn) params.set("pn", p.pn.trim());
  if (p.am) params.set("am", p.am.trim());
  params.set("cu", (p.cu ?? "INR").trim() || "INR");
  return `upi://pay?${params.toString()}`;
}

/* -------------------- Helpers -------------------- */

function encodeRFC3986Mailto(addr: string): string {
  return addr.replace(/[^A-Za-z0-9@._+-]/g, (c) => encodeURIComponent(c));
}
