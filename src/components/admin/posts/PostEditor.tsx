"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Clock, ExternalLink, ImageDown, Info, Save, Send, Trash2 } from "lucide-react";
import type { Block } from "@/types/content";
import { sections } from "@/config/sections";
import { cn, formatDate } from "@/lib/utils";
import { estimateReadTime, postSchema, type PostFormValues } from "@/lib/admin/schemas";
import { createPost, deletePost, updatePost } from "@/lib/admin/actions/posts";
import { daysLeft } from "@/lib/admin/expiry";
import { EMBED_HINT, embedProviderLabel, normaliseEmbed } from "@/lib/admin/embeds";
import { captureVideoFrame, prepareImage } from "@/lib/admin/media-client";
import { uploadBlob } from "@/lib/admin/upload-client";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Select } from "@/components/admin/ui/Select";
import { Switch } from "@/components/admin/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/Tabs";
import { ConfirmDialog } from "@/components/admin/ui/Dialog";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { BlockEditor } from "@/components/admin/posts/BlockEditor";
import { TagInput } from "@/components/admin/posts/TagInput";
import { UnsavedChangesGuard } from "@/components/admin/posts/UnsavedChangesGuard";

interface PostEditorProps {
  mode: "new" | "edit";
  postId?: string;
  initial: PostFormValues;
  categories: string[];
  meta?: { createdAt: string; expiresAt: string; updatedAt: string | null };
}

const AUTOSAVE_MS = 5000;
const draftKey = (mode: string, id: string | undefined, type: string) => `jb-admin-draft:${mode === "edit" && id ? id : `new:${type}`}`;

const toLocalInput = (iso: string) => {
  try {
    return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return "";
  }
};
const fromLocalInput = (local: string) => (local ? new Date(local).toISOString() : new Date().toISOString());

function makeSlug(title: string): string {
  const s = slugify(title, { lower: true, strict: true, trim: true }).slice(0, 100).replace(/-+$/, "");
  return s || `post-${Date.now().toString(36)}`;
}

export function PostEditor({ mode, postId, initial, categories, meta }: PostEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreDraft, setRestoreDraft] = useState<PostFormValues | null>(null);
  const [embedDraft, setEmbedDraft] = useState(initial.embedUrl ?? "");
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [capturing, setCapturing] = useState(false);
  const slugTouched = useRef(mode === "edit" || Boolean(initial.slug));
  const readTimeTouched = useRef(mode === "edit" && initial.readTimeMin != null);
  const submitStatus = useRef<PostFormValues["status"]>(initial.status);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initial,
    mode: "onBlur",
  });
  const { register, control, handleSubmit, setValue, getValues, reset, setError, formState } = form;
  const { errors, isDirty } = formState;

  const type = initial.type;
  const title = useWatch({ control, name: "title" });
  const slug = useWatch({ control, name: "slug" });
  const body = useWatch({ control, name: "body" });
  const excerpt = useWatch({ control, name: "excerpt" });
  const isBreaking = useWatch({ control, name: "isBreaking" });
  const coverImageUrl = useWatch({ control, name: "coverImageUrl" });
  const coverImagePath = useWatch({ control, name: "coverImagePath" });
  const mediaUrl = useWatch({ control, name: "mediaUrl" });
  const mediaPath = useWatch({ control, name: "mediaPath" });
  const embedUrl = useWatch({ control, name: "embedUrl" });
  const durationSec = useWatch({ control, name: "durationSec" });

  const folder = slug || "temp";
  const isAV = type === "video" || type === "podcast";
  const key = draftKey(mode, postId, type);

  /* ---- Slug from title (until edited by hand) ---- */
  useEffect(() => {
    if (slugTouched.current) return;
    setValue("slug", title ? makeSlug(title) : "", { shouldDirty: true });
  }, [title, setValue]);

  /* ---- Read time from body (until edited by hand) ---- */
  useEffect(() => {
    if (readTimeTouched.current || isAV) return;
    const est = estimateReadTime(body as Block[]);
    if (getValues("readTimeMin") !== est) setValue("readTimeMin", est);
  }, [body, isAV, getValues, setValue]);

  /* ---- Autosave to localStorage every 5s while dirty ---- */
  useEffect(() => {
    const t = window.setInterval(() => {
      if (!isDirty) return;
      try {
        localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), values: getValues() }));
      } catch {
        /* storage full or blocked */
      }
    }, AUTOSAVE_MS);
    return () => window.clearInterval(t);
  }, [isDirty, key, getValues]);

  /* ---- Offer to restore a local draft on mount ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { savedAt: number; values: PostFormValues };
      if (!parsed?.values || JSON.stringify(parsed.values) === JSON.stringify(initial)) {
        localStorage.removeItem(key);
        return;
      }
      setRestoreDraft(parsed.values);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const applyRestore = () => {
    if (restoreDraft) {
      reset(restoreDraft, { keepDefaultValues: true });
      slugTouched.current = true;
      readTimeTouched.current = true;
      setEmbedDraft(restoreDraft.embedUrl ?? "");
    }
    setRestoreDraft(null);
  };
  const discardRestore = () => {
    localStorage.removeItem(key);
    setRestoreDraft(null);
  };

  /* ---- Submit ---- */
  const onInvalid = () => {
    const first = Object.keys(errors)[0];
    toast.error("Please fix the highlighted fields", first ? { description: `Start with: ${first}` } : undefined);
  };

  const onValid = (values: PostFormValues) => {
    const payload = { ...values, status: submitStatus.current };
    startTransition(async () => {
      const result = mode === "new" ? await createPost(payload) : await updatePost(postId!, payload);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [k, msg] of Object.entries(result.fieldErrors)) {
            setError(k as keyof PostFormValues, { type: "server", message: msg });
          }
        }
        toast.error(result.error, result.fieldErrors ? { description: Object.values(result.fieldErrors)[0] } : undefined);
        return;
      }
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      const published = payload.status === "published";
      toast.success(published ? (mode === "new" ? "Published" : "Updated") : "Draft saved", {
        description: result.warning ?? (published ? "It's live on the site now." : "Only you can see drafts."),
      });
      if (mode === "new") {
        reset(payload); // clear dirty state before navigating
        router.replace(`/admin/posts/${result.id}`);
      } else {
        reset(payload);
        router.refresh();
      }
    });
  };

  const submitAs = (status: PostFormValues["status"]) => {
    submitStatus.current = status;
    setValue("status", status);
    void handleSubmit(onValid, onInvalid)();
  };

  const onDelete = async () => {
    if (!postId) return;
    const r = await deletePost(postId);
    if (r.ok) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      reset(getValues());
      toast.success("Post deleted", r.warning ? { description: r.warning } : undefined);
      router.push("/admin/posts");
    } else toast.error("Couldn't delete", { description: r.error });
  };

  /* ---- Embed link ---- */
  const commitEmbed = useCallback(
    (raw: string) => {
      setEmbedDraft(raw);
      if (!raw.trim()) {
        setEmbedError(null);
        setValue("embedUrl", null, { shouldDirty: true });
        return;
      }
      const info = normaliseEmbed(raw);
      if (!info) {
        setEmbedError(`That link isn't recognised. Paste a ${EMBED_HINT[type === "podcast" ? "podcast" : "video"]}.`);
        setValue("embedUrl", null, { shouldDirty: true });
        return;
      }
      setEmbedError(null);
      setValue("embedUrl", info.embedUrl, { shouldDirty: true });
    },
    [setValue, type],
  );
  const embedInfo = useMemo(() => (embedUrl ? normaliseEmbed(embedUrl) : null), [embedUrl]);

  /* ---- Use a video frame as the cover ---- */
  const useFrameAsCover = async () => {
    const source = videoFile ?? mediaUrl;
    if (!source) return;
    setCapturing(true);
    try {
      const frame = await captureVideoFrame(source, 1);
      const prepared = await prepareImage(new File([frame], "frame.jpg", { type: "image/jpeg" }));
      const uploaded = await uploadBlob({ blob: prepared.blob, contentType: prepared.contentType, ext: prepared.ext, folder });
      setValue("coverImageUrl", uploaded.url, { shouldDirty: true, shouldValidate: true });
      setValue("coverImagePath", uploaded.path, { shouldDirty: true });
      toast.success("Cover set from the video");
    } catch (e) {
      toast.error("Couldn't capture a frame", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setCapturing(false);
    }
  };

  const bodyError = (errors.body as { message?: string; root?: { message?: string } } | undefined)?.message ?? (errors.body as { root?: { message?: string } } | undefined)?.root?.message;
  const excerptLen = (excerpt ?? "").length;
  const sectionOptions = sections.map((s) => ({ value: s.slug, label: s.name, hint: <span lang="hi" className="hindi-sans">{s.nameHindi}</span> }));

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="pb-24">
      <UnsavedChangesGuard dirty={isDirty && !pending} />

      {restoreDraft && (
        <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-saffron bg-saffron/10 px-4 py-3">
          <p className="font-sans text-[0.9rem] text-ink">
            <strong>Restore unsaved draft?</strong> We kept a local backup of changes you didn&rsquo;t save.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={discardRestore}>Discard</Button>
            <Button size="sm" onClick={applyRestore}>Restore</Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* ============ Main column ============ */}
        <div className="grid gap-5 lg:col-span-8">
          <Card>
            <div className="grid gap-5">
              <Field htmlFor="title" label="Title" error={errors.title?.message}>
                <Textarea
                  id="title"
                  autoGrow
                  rows={1}
                  {...register("title")}
                  placeholder="Headline"
                  aria-invalid={Boolean(errors.title) || undefined}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  className="font-serif text-[1.5rem] font-semibold leading-tight"
                />
              </Field>
              <Field htmlFor="titleHindi" label="Hindi title" optional error={errors.titleHindi?.message}>
                <Input id="titleHindi" lang="hi" {...register("titleHindi")} placeholder="हिंदी शीर्षक" className="hindi-sans text-[1.05rem]" />
              </Field>
              <Field
                htmlFor="slug"
                label="Slug"
                hint={<>Address on the site: <span className="text-ink">/news/{slug || "…"}</span></>}
                error={errors.slug?.message}
              >
                <Input
                  id="slug"
                  {...register("slug", { onChange: () => (slugTouched.current = true) })}
                  placeholder="auto-generated-from-title"
                  spellCheck={false}
                  autoCapitalize="off"
                  aria-invalid={Boolean(errors.slug) || undefined}
                  aria-describedby={errors.slug ? "slug-error" : "slug-hint"}
                  className="font-mono text-[0.85rem]"
                />
              </Field>
              <Field htmlFor="standfirst" label="Standfirst" optional hint="One or two lines under the headline." error={errors.standfirst?.message}>
                <Textarea id="standfirst" autoGrow rows={2} {...register("standfirst")} placeholder="The sub-headline that sets the story up." aria-describedby="standfirst-hint" />
              </Field>
              <Field
                htmlFor="excerpt"
                label="Excerpt"
                hint="Shown on cards and in search. 160–220 characters works best."
                error={errors.excerpt?.message}
                trailing={<span className={cn(excerptLen > 220 && "text-saffron-dark", excerptLen > 400 && "text-breaking")}>{excerptLen} chars</span>}
              >
                <Textarea id="excerpt" autoGrow rows={3} {...register("excerpt")} placeholder="A short summary of the story." aria-invalid={Boolean(errors.excerpt) || undefined} aria-describedby={errors.excerpt ? "excerpt-error" : "excerpt-hint"} />
              </Field>
            </div>
          </Card>

          <Card
            title={type === "podcast" ? "Show notes" : type === "video" ? "Body (optional)" : "Body"}
            action={<span className="font-sans text-[0.75rem] text-muted">{type === "video" ? "A short description is enough" : type === "podcast" ? "What's in the episode" : null}</span>}
            flush
          >
            <div className="p-3 sm:p-4">
              <Controller
                control={control}
                name="body"
                render={({ field }) => <BlockEditor id="body" folder={folder} value={field.value as Block[]} onChange={(b) => field.onChange(b)} error={bodyError} />}
              />
              {bodyError && (
                <p role="alert" className="mt-2 font-sans text-[0.8rem] text-breaking">
                  {bodyError}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ============ Sidebar ============ */}
        <div className="grid content-start gap-5 lg:col-span-4">
          <Card title="Publishing">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Type</span>
                <TypeBadge type={type} />
              </div>
              <Field htmlFor="section" label="Section" error={errors.section?.message}>
                <Controller
                  control={control}
                  name="section"
                  render={({ field }) => <Select id="section" value={field.value} onValueChange={field.onChange} options={sectionOptions} invalid={Boolean(errors.section)} />}
                />
              </Field>
              <Field htmlFor="category" label="Category" hint="The kicker on the card, e.g. Environment." error={errors.category?.message}>
                <Input id="category" list="category-suggestions" {...register("category")} placeholder="Environment" aria-invalid={Boolean(errors.category) || undefined} aria-describedby={errors.category ? "category-error" : "category-hint"} />
                <datalist id="category-suggestions">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field htmlFor="tags" label="Tags" optional error={errors.tags?.message}>
                <Controller control={control} name="tags" render={({ field }) => <TagInput id="tags" value={field.value} onChange={field.onChange} />} />
              </Field>
              <Field htmlFor="status" label="Status">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      id="status"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[
                        { value: "draft", label: "Draft", hint: "only you can see it" },
                        { value: "published", label: "Published", hint: "live on the site" },
                      ]}
                    />
                  )}
                />
              </Field>
              <div className="divide-y divide-rule border-y border-rule">
                <Controller control={control} name="featured" render={({ field }) => <Switch id="featured" label="Featured" hint="Eligible for the lead slot on the front page." checked={field.value} onCheckedChange={field.onChange} />} />
                <Controller
                  control={control}
                  name="isBreaking"
                  render={({ field }) => (
                    <Switch
                      id="isBreaking"
                      tone="breaking"
                      label="Breaking"
                      hint={isBreaking ? <span className="text-breaking">Appears in the ticker and Breaking page.</span> : "Push it to the ticker."}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Field htmlFor="publishedAt" label="Published at" error={errors.publishedAt?.message}>
                <Controller
                  control={control}
                  name="publishedAt"
                  render={({ field }) => (
                    <Input id="publishedAt" type="datetime-local" value={toLocalInput(field.value)} onChange={(e) => field.onChange(fromLocalInput(e.target.value))} aria-invalid={Boolean(errors.publishedAt) || undefined} />
                  )}
                />
              </Field>
              <div className="grid grid-cols-[1fr_6.5rem] gap-3">
                <Field htmlFor="authorName" label="Author" error={errors.authorName?.message}>
                  <Input id="authorName" {...register("authorName")} aria-invalid={Boolean(errors.authorName) || undefined} />
                </Field>
                <Field htmlFor="readTimeMin" label="Read min" error={errors.readTimeMin?.message}>
                  <Controller
                    control={control}
                    name="readTimeMin"
                    render={({ field }) => (
                      <Input
                        id="readTimeMin"
                        type="number"
                        min={1}
                        max={180}
                        inputMode="numeric"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          readTimeTouched.current = true;
                          field.onChange(e.target.value === "" ? null : Number(e.target.value));
                        }}
                      />
                    )}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Cover image">
            <div className="grid gap-4">
              <Controller
                control={control}
                name="coverImageUrl"
                render={({ field }) => (
                  <div>
                    <MediaUploader
                      kind="image"
                      preview="cover"
                      folder={folder}
                      id="coverImageUrl"
                      value={coverImageUrl ? { url: coverImageUrl, path: coverImagePath } : null}
                      invalid={Boolean(errors.coverImageUrl)}
                      describedBy={errors.coverImageUrl ? "coverImageUrl-error" : undefined}
                      onChange={(v) => {
                        field.onChange(v?.url ?? "");
                        setValue("coverImagePath", v?.path ?? null, { shouldDirty: true });
                      }}
                    />
                    {errors.coverImageUrl && (
                      <p id="coverImageUrl-error" role="alert" className="mt-1.5 font-sans text-[0.8rem] text-breaking">
                        {errors.coverImageUrl.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {type === "video" && (videoFile || mediaUrl) && (
                <Button variant="ghost" size="sm" onClick={useFrameAsCover} loading={capturing}>
                  <ImageDown className="h-4 w-4" aria-hidden="true" /> Use a frame from the video as cover
                </Button>
              )}
              <Field htmlFor="coverAlt" label="Alt text" hint="Describe the picture for screen readers and search." error={errors.coverAlt?.message}>
                <Input id="coverAlt" {...register("coverAlt")} placeholder="Farmers walk along a flooded field near Haridwar" aria-describedby="coverAlt-hint" />
              </Field>
            </div>
          </Card>

          {isAV && (
            <Card title={type === "video" ? "Video" : "Audio"}>
              <Tabs defaultValue={initial.embedUrl && !initial.mediaUrl ? "embed" : "upload"}>
                <TabsList>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="embed">Embed link</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                  <MediaUploader
                    kind={type === "video" ? "video" : "audio"}
                    folder={folder}
                    allowUrl
                    value={mediaUrl ? { url: mediaUrl, path: mediaPath } : null}
                    invalid={Boolean(errors.mediaUrl)}
                    onChange={(v) => {
                      setValue("mediaUrl", v?.url ?? null, { shouldDirty: true, shouldValidate: true });
                      setValue("mediaPath", v?.path ?? null, { shouldDirty: true });
                      if (v?.durationSec != null) setValue("durationSec", v.durationSec, { shouldDirty: true });
                      if (!v) setValue("durationSec", null, { shouldDirty: true });
                      setVideoFile(v?.file ?? null);
                    }}
                  />
                  {durationSec != null && durationSec > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1.5 font-sans text-[0.8rem] text-muted">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Duration {Math.floor(durationSec / 60)}:{String(durationSec % 60).padStart(2, "0")}
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="embed" className="pt-4">
                  <Field htmlFor="embedUrl" label="Link" hint={`Paste a ${EMBED_HINT[type === "podcast" ? "podcast" : "video"]}. We convert it to an embed.`} error={embedError ?? undefined}>
                    <Input
                      id="embedUrl"
                      type="url"
                      inputMode="url"
                      value={embedDraft}
                      onChange={(e) => setEmbedDraft(e.target.value)}
                      onBlur={(e) => commitEmbed(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commitEmbed(embedDraft))}
                      placeholder="https://youtu.be/…"
                      aria-invalid={Boolean(embedError) || undefined}
                      aria-describedby={embedError ? "embedUrl-error" : "embedUrl-hint"}
                    />
                  </Field>
                  {embedInfo && (
                    <div className="mt-3">
                      <p className="mb-1.5 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted">{embedProviderLabel(embedInfo.provider)} preview</p>
                      <div className={cn("relative w-full overflow-hidden bg-ink", embedInfo.aspect === "video" ? "aspect-video" : embedInfo.aspect === "tall" ? "aspect-[4/5]" : embedInfo.aspect === "wide" ? "h-40" : "aspect-square")}>
                        <iframe title="Embed preview" src={embedInfo.embedUrl} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              {errors.mediaUrl && (
                <p role="alert" className="mt-3 font-sans text-[0.8rem] text-breaking">
                  {errors.mediaUrl.message}
                </p>
              )}
            </Card>
          )}

          <Card>
            <p className="flex items-start gap-2 font-sans text-[0.85rem] leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-saffron-dark" aria-hidden="true" />
              {meta ? (
                <span>
                  Uploaded on <span className="text-ink">{formatDate(meta.createdAt, "d MMM yyyy, HH:mm")}</span> · Auto-deletes on{" "}
                  <span className="text-ink">{formatDate(meta.expiresAt, "d MMM yyyy")}</span> ({Math.max(0, daysLeft(meta.expiresAt))} days left)
                </span>
              ) : (
                <span>Will auto-delete 30 days after saving. The countdown starts on first save, not on publish.</span>
              )}
            </p>
          </Card>

          {mode === "edit" && (
            <Card title="Danger zone">
              <p className="font-sans text-[0.85rem] text-muted">Deleting removes the post and its uploaded files immediately.</p>
              <Button variant="danger" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete post
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* ============ Sticky action bar ============ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur lg:left-[240px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <span className="mr-auto hidden font-sans text-[0.8rem] text-muted sm:block">
            {isDirty ? "Unsaved changes" : mode === "edit" && meta?.updatedAt ? `Saved ${formatDate(meta.updatedAt, "d MMM, HH:mm")}` : "No changes"}
          </span>
          {mode === "edit" && postId ? (
            <Button variant="ghost" href={`/admin/preview/${postId}`} external>
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> Preview
            </Button>
          ) : (
            <Button variant="ghost" disabled title="Save a draft first to preview">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> Preview
            </Button>
          )}
          <Button variant="secondary" onClick={() => submitAs("draft")} loading={pending && submitStatus.current === "draft"} disabled={pending}>
            <Save className="h-4 w-4" aria-hidden="true" /> Save draft
          </Button>
          <Button onClick={() => submitAs("published")} loading={pending && submitStatus.current === "published"} disabled={pending}>
            <Send className="h-4 w-4" aria-hidden="true" /> {mode === "new" || initial.status !== "published" ? "Publish" : "Update"}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this post?"
        description={<><strong className="text-ink">“{title || "Untitled"}”</strong> and its uploaded files will be removed immediately. This cannot be undone.</>}
        confirmLabel="Delete post"
        onConfirm={onDelete}
      />
    </form>
  );
}
