// /utils/iconPresets.ts
import { faGithub, faLinkedin, faInstagram, faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type IconPreset = {
  label: string;
  type: "favicon" | "fa";
  value: string | IconDefinition;
};

export const ICON_PRESETS: IconPreset[] = [
  // Brand icons (Font Awesome)
  { label: "GitHub", type: "fa", value: faGithub },
  { label: "LinkedIn", type: "fa", value: faLinkedin },
  { label: "Instagram", type: "fa", value: faInstagram },
  { label: "Twitter (X)", type: "fa", value: faTwitter },
  { label: "Facebook", type: "fa", value: faFacebook },

  // Generic icons
  { label: "Website", type: "fa", value: faGlobe },
  { label: "Email", type: "fa", value: faEnvelope },
  { label: "Profile", type: "fa", value: faUser },

  // Favicon examples
  { label: "YouTube Favicon", type: "favicon", value: "youtube.com" },
  { label: "Google Favicon", type: "favicon", value: "google.com" },
  { label: "Stack Overflow Favicon", type: "favicon", value: "stackoverflow.com" },
];
