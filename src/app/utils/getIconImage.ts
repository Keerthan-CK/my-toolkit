// /utils/getIconImage.ts
import { IconDefinition, library, icon } from "@fortawesome/fontawesome-svg-core";

/**
 * Get an image (PNG data URL) for embedding in a QR code.
 * 
 * @param type - "favicon" or "fa"
 * @param value - For "favicon", a domain (e.g., "github.com").
 *                For "fa", an IconDefinition from Font Awesome.
 * @returns 
 */
export async function getIconImage(
  type: "favicon" | "fa",
  value: string | IconDefinition
): Promise<string> {
  if (type === "favicon") {
    
    const url = `https://www.google.com/s2/favicons?sz=128&domain=${value}`;
    return url; 
  }

  if (type === "fa") {
    if (typeof value !== "object") {
      throw new Error("Font Awesome type requires IconDefinition object");
    }

  
    library.add(value);

    
    const faIcon = icon(value);
    if (!faIcon.html || !faIcon.html[0]) {
      throw new Error("Invalid Font Awesome icon");
    }
    const svgHTML = faIcon.html[0];

    
    return await svgToPngDataUrl(svgHTML, 128, 128);
  }

  throw new Error("Invalid icon type");
}


async function svgToPngDataUrl(svgMarkup: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas not supported");
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);
  });
}
