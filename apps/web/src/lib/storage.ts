import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export interface StorageProvider {
  upload(file: File, folder: string): Promise<{ url: string; sizeBytes: number }>;
}

class LocalStorageProvider implements StorageProvider {
  async upload(file: File, folder: string) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(dir, safeName);
    await writeFile(filePath, bytes);
    return {
      url: `/uploads/${folder}/${safeName}`,
      sizeBytes: bytes.length,
    };
  }
}

class VercelBlobStorageProvider implements StorageProvider {
  async upload(file: File, folder: string) {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return { url: blob.url, sizeBytes: file.size };
  }
}

export function getStorageProvider(): StorageProvider {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobStorageProvider();
  }
  return new LocalStorageProvider();
}

const MAX_PROFILE_PHOTO_BYTES = 4 * 1024 * 1024;

function isAcceptedImage(file: File, bytes: Buffer) {
  if (file.type.startsWith("image/")) return true;
  if (/\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name)) return true;
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return true;
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true;
  }
  return false;
}

function imageMimeType(file: File, bytes: Buffer) {
  if (file.type.startsWith("image/")) return file.type;
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  return "image/jpeg";
}

/** Profile photos must work on Vercel even without Blob — falls back to a data URL. */
export async function uploadProfilePhoto(
  file: File
): Promise<{ url: string; sizeBytes: number }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) {
    throw new Error("No file selected.");
  }
  if (!isAcceptedImage(file, bytes)) {
    throw new Error("Please choose a JPG, PNG, or iPhone photo.");
  }
  if (bytes.length > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error("Photo must be under 4 MB.");
  }

  const mime = imageMimeType(file, bytes);
  const uploadFile =
    file.type === mime
      ? file
      : new File([bytes], file.name.replace(/\.[^.]+$/i, ".jpg") || "photo.jpg", { type: mime });

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return getStorageProvider().upload(uploadFile, "photos");
  }

  if (!process.env.VERCEL) {
    return getStorageProvider().upload(uploadFile, "photos");
  }

  const base64 = bytes.toString("base64");
  return {
    url: `data:${mime};base64,${base64}`,
    sizeBytes: bytes.length,
  };
}
