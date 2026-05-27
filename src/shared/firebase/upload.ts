"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "./client";

const MAX_SOURCE_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_WEBP_DIMENSION = 1600;
const WEBP_QUALITY = 0.88;

export function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Envie um arquivo de imagem.";
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    return "A imagem original deve ter no máximo 10MB.";
  }

  return "";
}

export async function uploadCmsImage(file: File, folder: string) {
  const validationError = validateImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const uploadFile = await prepareImageForUpload(file, folder);
  const fileName = `${Date.now()}-${uploadFile.fileName}`;
  const fileRef = ref(getFirebaseStorage(), `${folder}/${fileName}`);
  await uploadBytes(fileRef, uploadFile.blob, { contentType: uploadFile.contentType });
  return getDownloadURL(fileRef);
}

async function prepareImageForUpload(file: File, folder: string) {
  if (file.type === "image/svg+xml" && folder.startsWith("cms/alphabet")) {
    assertUploadSize(file);
    return {
      blob: file,
      contentType: file.type,
      fileName: sanitizeFileName(file.name),
    };
  }

  const webpBlob = await convertToWebp(file);
  assertUploadSize(webpBlob);

  return {
    blob: webpBlob,
    contentType: "image/webp",
    fileName: `${sanitizeBaseFileName(file.name)}.webp`,
  };
}

async function convertToWebp(file: File) {
  const image = await loadImage(file);
  const { height, width } = getTargetSize(image.width, image.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não foi possível converter a imagem.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvasToBlob(canvas);
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a imagem."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Não foi possível gerar WEBP."));
        return;
      }

      resolve(blob);
    }, "image/webp", WEBP_QUALITY);
  });
}

function getTargetSize(width: number, height: number) {
  const scale = Math.min(1, MAX_WEBP_DIMENSION / Math.max(width, height));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function assertUploadSize(blob: Blob) {
  if (blob.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error("A imagem final deve ter no máximo 3MB.");
  }
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function sanitizeBaseFileName(fileName: string) {
  return sanitizeFileName(fileName.replace(/\.[^.]+$/, ""));
}
