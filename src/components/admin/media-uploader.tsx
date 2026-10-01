"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./media-uploader.module.css";

type Item = {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  message?: string;
  url?: string | null;
};

const pretty = (bytes: number) =>
  bytes > 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export function MediaUploader() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>([]);

  function update(name: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, ...patch } : i)));
  }

  async function upload(file: File) {
    setItems((prev) => [{ name: file.name, size: file.size, status: "uploading" }, ...prev]);

    try {
      const res = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });

      const data = await res.json();

      if (!res.ok) {
        update(file.name, { status: "error", message: data.error ?? "Upload refused" });
        return;
      }
      if (data.configured === false) {
        update(file.name, { status: "error", message: data.message });
        return;
      }

      // Browser uploads straight to R2 — the file never touches our server.
      const put = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!put.ok) {
        update(file.name, { status: "error", message: "Storage rejected the file" });
        return;
      }

      update(file.name, { status: "done", url: data.publicUrl });
    } catch {
      update(file.name, { status: "error", message: "Network error during upload" });
    }
  }

  function handle(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(upload);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
        className={cn(styles.dropzone, dragging ? styles.dropzoneActive : styles.dropzoneIdle)}
      >
        <span className={styles.dropIcon}>
          <UploadCloud className={styles.dropIconSvg} strokeWidth={1.8} />
        </span>
        <p className={styles.dropTitle}>Drop files here</p>
        <p className={styles.dropHint}>
          Images, MP4 or PDF · up to 25 MB each
        </p>
        <Button variant="outline" size="sm" className={styles.chooseButton} onClick={() => inputRef.current?.click()}>
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => handle(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((i) => (
            <li
              key={i.name}
              className={styles.item}
            >
              {i.status === "uploading" && <Loader2 className={cn(styles.statusIcon, styles.statusUploading)} />}
              {i.status === "done" && <CheckCircle2 className={cn(styles.statusIcon, styles.statusDone)} />}
              {i.status === "error" && <AlertCircle className={cn(styles.statusIcon, styles.statusError)} />}

              <span className={styles.itemBody}>
                <span className={styles.itemName}>{i.name}</span>
                {i.message && (
                  <span className={styles.itemMessage}>{i.message}</span>
                )}
                {i.url && (
                  <a
                    href={i.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.itemUrl}
                  >
                    {i.url}
                  </a>
                )}
              </span>

              <span className={styles.itemSize}>{pretty(i.size)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
