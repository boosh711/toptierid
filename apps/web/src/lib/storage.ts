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

/** Profile photos must work on Vercel even without Blob — falls back to a data URL. */
export async function uploadProfilePhoto(
  file: File
): Promise<{ url: string; sizeBytes: number }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, etc.).");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error("Photo must be under 4 MB.");
  }
  if (bytes.length === 0) {
    throw new Error("No file selected.");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return getStorageProvider().upload(file, "photos");
  }

  if (!process.env.VERCEL) {
    return getStorageProvider().upload(file, "photos");
  }

  const base64 = bytes.toString("base64");
  return {
    url: `data:${file.type};base64,${base64}`,
    sizeBytes: bytes.length,
  };
}
