"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/server/atoms/Button";
import { Icon } from "@/components/server/atoms/Icon";
import type { IconType } from "@/components/server/atoms/Icon/types";
import styles from "./FileUploader.module.scss";

import type { FileRejectReason, FileUploaderProps, UploadItem } from "./types";
import { formatFileSize, validateFile } from "./validateFile";

const DEFAULT_DROP_LABEL = "Arrastra tus archivos aquí";
const DEFAULT_SELECT_LABEL = "Seleccionar archivos";
const DEFAULT_TYPE_MESSAGE =
  "Rechazado: formato no permitido. Quítalo o reemplázalo para poder enviar.";
const DEFAULT_SIZE_MESSAGE =
  "Rechazado: el archivo supera el tamaño permitido. Quítalo o reemplázalo para poder enviar.";
const DEFAULT_TOTAL_MESSAGE =
  "Rechazado: el total de los archivos supera el tamaño permitido. Quítalo o reemplázalo para poder enviar.";
const DEFAULT_LIMIT_MESSAGE =
  "Rechazado: se superó el límite de archivos. Quítalo o reemplázalo para poder enviar.";

const STATUS_ICON: Record<UploadItem["status"], IconType> = {
  loaded: "Check",
  error: "Exclamation",
};

function resolveFileLimit(maxFiles: number): number {
  if (!Number.isFinite(maxFiles) || maxFiles < 1) return 1;
  return Math.floor(maxFiles);
}

export default function FileUploader({
  accept,
  maxSizeBytes,
  maxTotalSizeBytes,
  maxFiles,
  onChange,
  dropLabel = DEFAULT_DROP_LABEL,
  selectLabel = DEFAULT_SELECT_LABEL,
  invalidTypeMessage = DEFAULT_TYPE_MESSAGE,
  invalidSizeMessage = DEFAULT_SIZE_MESSAGE,
  totalSizeMessage = DEFAULT_TOTAL_MESSAGE,
  limitMessage = DEFAULT_LIMIT_MESSAGE,
  disabled = false,
}: FileUploaderProps) {
  const fileLimit = resolveFileLimit(maxFiles);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const itemsRef = useRef<UploadItem[]>([]);
  const dragDepthRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  const loadedIds = items
    .filter((item) => item.status === "loaded")
    .map((item) => item.id)
    .join("|");

  useEffect(() => {
    onChangeRef.current?.(
      itemsRef.current
        .filter((item) => item.status === "loaded")
        .map((item) => item.file),
    );
  }, [loadedIds]);

  function updateItems(updater: (prev: UploadItem[]) => UploadItem[]) {
    const next = updater(itemsRef.current);
    itemsRef.current = next;
    setItems(next);
  }

  function addFiles(files: File[]) {
    if (disabled || files.length === 0) return;

    const created: UploadItem[] = [];
    let count = itemsRef.current.length;
    let totalBytes = itemsRef.current.reduce(
      (sum, item) => (item.status === "loaded" ? sum + item.file.size : sum),
      0,
    );

    for (const file of files) {
      const reason = validateFile({
        file,
        accept,
        maxSizeBytes,
        maxTotalSizeBytes,
        currentTotalBytes: totalBytes,
        currentCount: count,
        maxFiles: fileLimit,
      });

      created.push({
        id: crypto.randomUUID(),
        file,
        status: reason ? "error" : "loaded",
        error: reason ?? undefined,
      });
      count += 1;
      if (!reason) totalBytes += file.size;
    }

    updateItems((prev) => [...prev, ...created]);
  }

  function removeItem(id: string) {
    updateItems((prev) => prev.filter((item) => item.id !== id));
  }

  function messageFor(reason: FileRejectReason): string {
    if (reason === "type") return invalidTypeMessage;
    if (reason === "size") return invalidSizeMessage;
    if (reason === "total") return totalSizeMessage;
    return limitMessage;
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragDepthRef.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDragging(false);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (disabled) return;
    addFiles(Array.from(event.dataTransfer.files));
  }

  const acceptAttr = accept
    .map((rule) => rule.trim())
    .filter(Boolean)
    .join(",");

  return (
    <div className={styles.root}>
      <div
        className={classNames(
          styles.dropzone,
          isDragging && styles.dropzoneActive,
          disabled && styles.dropzoneDisabled,
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Text className={styles.dropLabel}>{dropLabel}</Text>
        <Button
          type="button"
          variant="outline"
          className={styles.selectButton}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {selectLabel}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className={styles.input}
          accept={acceptAttr}
          multiple={fileLimit > 1}
          disabled={disabled}
          tabIndex={-1}
          aria-label={selectLabel}
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item) => {
            return (
              <li
                key={item.id}
                className={classNames(
                  styles.file,
                  item.status === "error" && styles.fileError,
                )}
              >
                <div className={styles.fileMain}>
                  <Icon
                    name={STATUS_ICON[item.status]}
                    className={classNames(
                      styles.fileIcon,
                      item.status === "loaded" && styles.iconLoaded,
                      item.status === "error" && styles.iconError,
                    )}
                    width={32}
                    height={32}
                    aria-hidden
                  />
                  <div className={styles.fileText}>
                    <Text className={styles.fileName} variant="Large">{item.file.name}</Text>
                    {item.status === "loaded" && (
                      <Text className={styles.metaLoaded} variant="Small">
                        {formatFileSize(item.file.size)} · Cargado
                      </Text>
                    )}
                    {item.status === "error" && item.error && (
                      <Text className={styles.metaError} variant="Small">{messageFor(item.error)}</Text>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={styles.actionButton}
                  disabled={disabled}
                  aria-label={`Quitar ${item.file.name}`}
                  onClick={() => removeItem(item.id)}
                >
                  Quitar
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
