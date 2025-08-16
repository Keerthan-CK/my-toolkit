// utils/embedImageInQr.ts
import { Options } from "qr-code-styling";


export function embedImageInQr(
  options: Partial<Options>,
  url?: string,
  logoWidth?: number,
  logoHeight?: number
): Partial<Options> {
  if (!url) return options;

  const qrWidth = Number(options.width ?? 300);

  // prefer the larger logo dimension for scaling (keeps aspect ratio safe)
  const logoMaxDim = Math.max(logoWidth ?? 0, logoHeight ?? 0);

  // Default ratio when no dimensions passed
  let ratio = 0.2; // 20% default

  if (logoMaxDim > 0) {
    // approximate how big the logo would be relative to QR width (logoPx / qrPx)
    const raw = logoMaxDim / qrWidth;
    // clamp to a safe range so we don't break scannability
    ratio = Math.min(0.35, Math.max(0.10, raw));
  }

  // Use the typed imageOptions if present
  const existingImageOptions = options.imageOptions as Options["imageOptions"] | undefined;
  const margin = existingImageOptions?.margin ?? 5;

  return {
    ...options,
    image: url,
    imageOptions: {
      ...(existingImageOptions ?? {}),
      crossOrigin: "anonymous",
      hideBackgroundDots: false,
      imageSize: ratio,
      margin,
    },
  };
}
