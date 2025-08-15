// /utils/downloadQr.ts
import QRCodeStyling from "qr-code-styling";

type DownloadFormat = "png" | "jpeg" | "svg";

/**
 * Downloads the generated QR code.
 * @param qrInstance - Instance of QRCodeStyling
 * @param fileName - Name of the file without extension
 * @param format - File type: png | jpeg | svg
 */
export async function downloadQr(
  qrInstance: QRCodeStyling,
  fileName = "my-qr-code",
  format: DownloadFormat = "png"
) {
  if (!qrInstance) {
    console.error("QR instance not available for download.");
    return;
  }

  try {
    await qrInstance.download({
      name: fileName,
      extension: format,
    });
  } catch (err) {
    console.error("Failed to download QR:", err);
  }
}
