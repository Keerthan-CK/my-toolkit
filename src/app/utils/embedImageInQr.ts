// /utils/embedImageInQr.ts
import { Options } from "qr-code-styling";

/**
 * Merges a QR code base config with a logo (if provided)
 * @param baseOptions - The core QRCodeStyling options
 * @param logoDataUrl - Optional DataURL string for logo image
 */
export function embedImageInQr(
  baseOptions: Options,
  logoDataUrl?: string
): Options {
  if (!logoDataUrl) {
    
    return { ...baseOptions, image: undefined };
  }

  return {
    ...baseOptions,
    image: logoDataUrl,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8, 
      hideBackgroundDots: false, 
    },
  };
}
