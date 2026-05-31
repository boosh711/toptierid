function isHeicFile(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/i, "") || "profile";
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.82,
  });
  const jpegBlob = Array.isArray(result) ? result[0] : result;
  return new File([jpegBlob], `${baseName(file)}.jpg`, { type: "image/jpeg" });
}

async function compressImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;

  const bitmap = await createImageBitmap(file);
  const maxWidth = 960;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.82);
  });
  if (!blob) return file;

  return new File([blob], `${baseName(file)}.jpg`, { type: "image/jpeg" });
}

/** Normalize iPhone HEIC and other formats to a JPEG ready for upload. */
export async function prepareProfilePhoto(file: File): Promise<File> {
  let working = file;

  if (isHeicFile(file)) {
    working = await convertHeicToJpeg(file);
  } else if (!file.type.startsWith("image/") && file.type !== "") {
    throw new Error("Please choose a JPG, PNG, or iPhone photo.");
  }

  try {
    return await compressImage(working);
  } catch {
    if (working.type === "image/jpeg" || working.type === "image/png") {
      return working;
    }
    throw new Error(
      "Could not read that photo. Try JPG or PNG, or take a new photo on your phone."
    );
  }
}

export async function previewProfilePhoto(file: File): Promise<string> {
  const prepared = await prepareProfilePhoto(file);
  return URL.createObjectURL(prepared);
}
