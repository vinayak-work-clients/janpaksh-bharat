"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { Camera, FileAudio, FileVideo, ImagePlus, Link2, Loader2, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPT_ATTR, formatBytes, normaliseMime, extensionFor, validateFile, type UploadKind } from "@/lib/admin/storage";
import { prepareImage, readDuration } from "@/lib/admin/media-client";
import { removeUploaded, uploadBlob } from "@/lib/admin/upload-client";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";

export interface MediaValue {
  url: string;
  path: string | null;
}

export interface MediaChange extends MediaValue {
  durationSec?: number | null;
  /** The local file (video only) so the editor can grab a frame for the cover. */
  file?: File;
}

interface MediaUploaderProps {
  kind: UploadKind;
  value: MediaValue | null;
  onChange: (next: MediaChange | null) => void;
  /** Folder inside the bucket (post slug or "temp"). */
  folder: string;
  id?: string;
  /** Allow pasting an external URL instead of uploading. */
  allowUrl?: boolean;
  /** Image preview: 16:9 + 4:5 crops (cover), single 3:2 (body image) or none. */
  preview?: "cover" | "single" | "none";
  /** Tighter chrome for block editor use. */
  compact?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "processing"; name: string }
  | { kind: "uploading"; name: string; size: number; percent: number }
  | { kind: "error"; message: string };

const ICON: Record<UploadKind, typeof ImagePlus> = { image: ImagePlus, video: FileVideo, audio: FileAudio };

export function MediaUploader({ kind, value, onChange, folder, id, allowUrl = true, preview = "cover", compact = false, invalid, describedBy }: MediaUploaderProps) {
  const inputId = useId();
  const controlId = id ?? inputId;
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Paths uploaded during this editing session: safe to delete when replaced. */
  const sessionPaths = useRef<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  useEffect(() => () => abortRef.current?.abort(), []);

  const discardPrevious = useCallback(async (prev: MediaValue | null) => {
    if (prev?.path && sessionPaths.current.has(prev.path)) {
      sessionPaths.current.delete(prev.path);
      await removeUploaded([prev.path]);
    }
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const problem = validateFile(file, kind);
      if (problem) {
        setStatus({ kind: "error", message: problem });
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const previous = value;
      try {
        let blob: Blob = file;
        let contentType = normaliseMime(file);
        let ext = extensionFor(contentType, file.name);
        let durationSec: number | null | undefined;

        if (kind === "image") {
          setStatus({ kind: "processing", name: file.name });
          const prepared = await prepareImage(file);
          blob = prepared.blob;
          contentType = prepared.contentType;
          ext = prepared.ext;
        } else {
          durationSec = await readDuration(file, kind);
        }
        if (controller.signal.aborted) return;

        setStatus({ kind: "uploading", name: file.name, size: blob.size, percent: 0 });
        const uploaded = await uploadBlob({
          blob,
          contentType,
          ext,
          folder,
          signal: controller.signal,
          onProgress: (p) => setStatus({ kind: "uploading", name: file.name, size: blob.size, percent: p.percent }),
        });
        sessionPaths.current.add(uploaded.path);
        setStatus({ kind: "idle" });
        onChange({ url: uploaded.url, path: uploaded.path, durationSec, file: kind === "video" ? file : undefined });
        void discardPrevious(previous);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          setStatus({ kind: "idle" });
          return;
        }
        setStatus({ kind: "error", message: e instanceof Error ? e.message : "Upload failed. Please try again." });
      } finally {
        if (inputRef.current) inputRef.current.value = "";
        if (cameraRef.current) cameraRef.current.value = "";
      }
    },
    [kind, folder, onChange, value, discardPrevious],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onPaste = (e: ClipboardEvent) => {
    if (kind !== "image") return;
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (file) {
      e.preventDefault();
      void handleFile(file);
    }
  };

  const remove = async () => {
    abortRef.current?.abort();
    const prev = value;
    onChange(null);
    setStatus({ kind: "idle" });
    await discardPrevious(prev);
  };

  const applyUrl = () => {
    const url = urlDraft.trim();
    if (!/^https?:\/\//i.test(url)) {
      setStatus({ kind: "error", message: "Paste a full link starting with https://" });
      return;
    }
    const prev = value;
    onChange({ url, path: null });
    setUrlMode(false);
    setUrlDraft("");
    setStatus({ kind: "idle" });
    void discardPrevious(prev);
  };

  const Icon = ICON[kind];
  const busy = status.kind === "processing" || status.kind === "uploading";
  const label = kind === "image" ? "image" : kind === "video" ? "video" : "audio";
  const limits = kind === "image" ? "JPG, PNG, WebP · up to 10 MB" : kind === "video" ? "MP4, WebM, MOV · up to 50 MB" : "MP3, M4A, WAV · up to 50 MB";

  /* ---- Filled state ---- */
  if (value && !busy) {
    return (
      <div className={cn("border border-rule bg-paper", invalid && "border-breaking")} aria-describedby={describedBy}>
        {kind === "image" && preview !== "none" && (
          <div className={cn("grid gap-2 p-2", preview === "cover" && !compact ? "grid-cols-[3fr_2fr]" : "grid-cols-1")}>
            <div className={cn("relative overflow-hidden bg-paper-2", preview === "cover" ? "aspect-video" : "aspect-[3/2]")}>
              <Image src={value.url} alt="" fill unoptimized sizes="400px" className="object-cover" />
              {preview === "cover" && <span className="absolute bottom-1 left-1 rounded-sm bg-ink/70 px-1.5 py-0.5 font-sans text-[0.6rem] uppercase tracking-wider text-paper">16:9 · cards</span>}
            </div>
            {preview === "cover" && !compact && (
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                <Image src={value.url} alt="" fill unoptimized sizes="200px" className="object-cover" />
                <span className="absolute bottom-1 left-1 rounded-sm bg-ink/70 px-1.5 py-0.5 font-sans text-[0.6rem] uppercase tracking-wider text-paper">4:5 · mobile</span>
              </div>
            )}
          </div>
        )}
        {kind === "video" && (
          <div className="p-2">
            <video src={value.url} controls preload="metadata" playsInline className="aspect-video w-full bg-ink" />
          </div>
        )}
        {kind === "audio" && (
          <div className="p-2">
            <audio src={value.url} controls preload="metadata" className="w-full" />
          </div>
        )}
        <div className="flex items-center justify-between gap-2 border-t border-rule px-2 py-1.5">
          <span className="min-w-0 flex-1 truncate font-sans text-[0.75rem] text-muted" title={value.path ?? value.url}>
            {value.path ? `Uploaded · ${value.path.split("/").pop()}` : `External link · ${value.url}`}
          </span>
          <Button variant="subtle" size="sm" onClick={() => inputRef.current?.click()}>
            Replace
          </Button>
          <Button variant="subtle" size="sm" onClick={remove} aria-label={`Remove ${label}`}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPT_ATTR[kind]} className="sr-only" onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])} />
      </div>
    );
  }

  /* ---- Progress state ---- */
  if (busy) {
    const percent = status.kind === "uploading" ? status.percent : null;
    return (
      <div className="border border-rule bg-paper p-4" role="status" aria-live="polite">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-saffron-dark" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-[0.85rem] font-medium text-ink">
              {status.kind === "processing" ? "Preparing" : "Uploading"} {status.name}
            </p>
            <p className="font-sans text-[0.75rem] text-muted">
              {status.kind === "uploading" ? `${formatBytes(status.size)} · ${status.percent}%` : "Resizing and converting…"}
            </p>
          </div>
          <Button variant="subtle" size="sm" onClick={() => abortRef.current?.abort()}>
            <X className="h-4 w-4" aria-hidden="true" /> Cancel
          </Button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden bg-paper-2">
          <div
            className={cn("h-full bg-saffron transition-[width] duration-200", percent === null && "w-1/3 animate-pulse")}
            style={percent === null ? undefined : { width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  /* ---- Empty / dropzone state ---- */
  return (
    <div aria-describedby={describedBy}>
      <div
        role="group"
        aria-label={`Upload ${label}`}
        tabIndex={0}
        onPaste={onPaste}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center border border-dashed px-4 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron/50",
          compact ? "py-5" : "py-8",
          dragging ? "border-saffron bg-saffron/10" : "border-rule bg-paper-2/40 hover:border-ink/40",
          invalid && "border-breaking",
        )}
      >
        <Icon className={cn("text-muted", compact ? "h-6 w-6" : "h-8 w-8")} strokeWidth={1.5} aria-hidden="true" />
        <p className={cn("mt-3 font-sans font-medium text-ink", compact ? "text-[0.85rem]" : "text-[0.95rem]")}>
          Drop {kind === "image" ? "an" : "a"} {label} here{kind === "image" ? ", paste it," : ""} or
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" /> Choose file
          </Button>
          {kind === "image" && (
            <Button variant="ghost" size="sm" onClick={() => cameraRef.current?.click()} className="sm:hidden">
              <Camera className="h-4 w-4" aria-hidden="true" /> Camera
            </Button>
          )}
          {allowUrl && (
            <Button variant="ghost" size="sm" onClick={() => setUrlMode((v) => !v)}>
              <Link2 className="h-4 w-4" aria-hidden="true" /> Use a link
            </Button>
          )}
        </div>
        <p className="mt-3 font-sans text-[0.72rem] text-muted">{limits}</p>
        <input id={controlId} ref={inputRef} type="file" accept={ACCEPT_ATTR[kind]} className="sr-only" onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])} />
        {kind === "image" && (
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])} />
        )}
      </div>
      {urlMode && (
        <div className="mt-2 flex gap-2">
          <Input
            type="url"
            inputMode="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyUrl())}
            placeholder={`https://… link to ${kind === "image" ? "an image" : `a ${label} file`}`}
            aria-label={`${label} link`}
          />
          <Button variant="secondary" size="md" onClick={applyUrl}>
            Use
          </Button>
        </div>
      )}
      {status.kind === "error" && (
        <p role="alert" className="mt-2 font-sans text-[0.8rem] text-breaking">
          {status.message}
        </p>
      )}
    </div>
  );
}
