import { z } from "zod";
import type { FileRejectReason } from "./types";

export type ValidateFileInput = {
  file: File;
  accept: string[];
  maxSizeBytes: number;
  maxTotalSizeBytes: number;
  currentTotalBytes: number;
  currentCount: number;
  maxFiles: number;
};

/**
 * Cupo, tipo, tamaño por archivo y tamaño total, en ese orden.
 * El tipo y el tamaño de cada archivo los resuelve Zod (`z.file().mime().max()`).
 * `null` significa que el archivo se acepta.
 */
export function validateFile({
  file,
  accept,
  maxSizeBytes,
  maxTotalSizeBytes,
  currentTotalBytes,
  currentCount,
  maxFiles,
}: ValidateFileInput): FileRejectReason | null {
  if (currentCount >= maxFiles) return "limit";

  const parsed = z.file().mime(accept).max(maxSizeBytes).safeParse(file);
  if (!parsed.success) {
    const failedType = parsed.error.issues.some((issue) => issue.code !== "too_big");
    return failedType ? "type" : "size";
  }

  if (currentTotalBytes + file.size > maxTotalSizeBytes) return "total";
  return null;
}

function withOneDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${withOneDecimal(kilobytes)} KB`;

  return `${withOneDecimal(bytes / (1024 * 1024))} MB`;
}
