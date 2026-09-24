"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, ClipboardPaste, Copy, Heading2, Image as ImageIcon, List, Pilcrow, Plus, Quote, Trash2 } from "lucide-react";
import type { Block } from "@/types/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/admin/ui/Button";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Input } from "@/components/admin/ui/Input";
import { Tooltip } from "@/components/admin/ui/Tooltip";
import { DialogRoot, DialogContent } from "@/components/admin/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/admin/ui/DropdownMenu";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface BlockEditorProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
  /** Upload folder for image blocks (post slug or "temp"). */
  folder: string;
  error?: string;
  id?: string;
}

type BlockType = Block["type"];

const TYPES: Array<{ type: BlockType; label: string; Icon: typeof Pilcrow }> = [
  { type: "p", label: "Paragraph", Icon: Pilcrow },
  { type: "h2", label: "Heading", Icon: Heading2 },
  { type: "quote", label: "Quote", Icon: Quote },
  { type: "image", label: "Image", Icon: ImageIcon },
  { type: "list", label: "List", Icon: List },
];

function newBlock(type: BlockType): Block {
  switch (type) {
    case "p":
      return { type: "p", text: "" };
    case "h2":
      return { type: "h2", text: "" };
    case "quote":
      return { type: "quote", text: "", cite: "" };
    case "image":
      return { type: "image", src: "", caption: "", alt: "" };
    case "list":
      return { type: "list", items: [""] };
  }
}

/** Split pasted prose into paragraphs on blank lines (single newlines join). */
export function splitArticle(text: string): Block[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n+/)
    .map((chunk) => chunk.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .map((t) => ({ type: "p", text: t }) as Block);
}

export function BlockEditor({ value, onChange, folder, error, id }: BlockEditorProps) {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteMode, setPasteMode] = useState<"append" | "replace">("append");
  const focusIndex = useRef<number | null>(null);
  const refs = useRef<Array<HTMLTextAreaElement | null>>([]);

  const update = (i: number, block: Block) => onChange(value.map((b, j) => (j === i ? block : b)));
  const insertAt = (i: number, block: Block) => {
    onChange([...value.slice(0, i), block, ...value.slice(i)]);
    focusIndex.current = i;
    queueMicrotask(() => refs.current[i]?.focus());
  };
  const remove = (i: number) => {
    onChange(value.filter((_, j) => j !== i));
    const target = Math.max(0, i - 1);
    queueMicrotask(() => {
      const el = refs.current[target];
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const duplicate = (i: number) => insertAt(i + 1, JSON.parse(JSON.stringify(value[i])) as Block);

  const onTextKey = (i: number, block: Block) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
    if (e.key === "Enter" && !e.shiftKey && block.type === "p" && atEnd) {
      e.preventDefault();
      insertAt(i + 1, newBlock("p"));
    } else if (e.key === "Enter" && !e.shiftKey && block.type === "h2") {
      e.preventDefault();
      insertAt(i + 1, newBlock("p"));
    } else if (e.key === "Backspace" && el.value === "" && value.length > 1) {
      e.preventDefault();
      remove(i);
    }
  };

  const applyPaste = () => {
    const blocks = splitArticle(pasteText);
    if (!blocks.length) return;
    const existing = pasteMode === "replace" ? [] : value.filter((b) => !(b.type === "p" && !b.text.trim()));
    onChange([...existing, ...blocks]);
    setPasteOpen(false);
    setPasteText("");
  };

  const AddMenu = ({ at, subtle = false }: { at: number; subtle?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Add block"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full font-sans font-medium transition-colors",
            subtle
              ? "h-8 px-2.5 text-[0.75rem] text-muted opacity-0 hover:bg-paper-2 hover:text-ink focus-visible:opacity-100 group-hover/gap:opacity-100"
              : "h-11 border border-dashed border-rule px-4 text-[0.85rem] text-ink hover:border-ink",
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {subtle ? "Insert" : "Add block"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {TYPES.map(({ type, label, Icon }) => (
          <DropdownMenuItem key={type} icon={<Icon />} onSelect={() => insertAt(at, newBlock(type))}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div id={id} className={cn("border border-rule bg-paper", error && "border-breaking")}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-3 py-2">
        <span className="font-sans text-[0.75rem] text-muted">
          {value.length} block{value.length === 1 ? "" : "s"} · Enter starts a new paragraph, Backspace on an empty block removes it
        </span>
        <Button variant="ghost" size="sm" onClick={() => setPasteOpen(true)}>
          <ClipboardPaste className="h-4 w-4" aria-hidden="true" /> Paste article
        </Button>
      </div>

      <ol className="divide-y divide-rule">
        {value.map((block, i) => {
          const meta = TYPES.find((t) => t.type === block.type)!;
          return (
            <li key={i} className="group relative">
              <div className="group/gap absolute -top-4 left-3 z-10 h-8">
                <AddMenu at={i} subtle />
              </div>
              <div className="flex gap-2 px-3 py-3 sm:gap-3">
                <div className="flex w-6 shrink-0 flex-col items-center pt-2 sm:w-7">
                  <Tooltip content={meta.label}>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-paper-2 text-muted">
                      <meta.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Tooltip>
                </div>

                <div className="min-w-0 flex-1">
                  {(block.type === "p" || block.type === "h2") && (
                    <Textarea
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      autoGrow
                      rows={block.type === "h2" ? 1 : 2}
                      value={block.text}
                      onChange={(e) => update(i, { ...block, text: e.target.value })}
                      onKeyDown={onTextKey(i, block)}
                      placeholder={block.type === "h2" ? "Section heading" : "Write a paragraph…"}
                      aria-label={`${meta.label} ${i + 1}`}
                      className={cn("border-transparent bg-transparent px-2 hover:border-rule", block.type === "h2" && "font-serif text-[1.25rem] font-semibold")}
                    />
                  )}
                  {block.type === "quote" && (
                    <div className="grid gap-2 border-l-[3px] border-saffron pl-3">
                      <Textarea
                        ref={(el) => {
                          refs.current[i] = el;
                        }}
                        autoGrow
                        rows={2}
                        value={block.text}
                        onChange={(e) => update(i, { ...block, text: e.target.value })}
                        onKeyDown={onTextKey(i, block)}
                        placeholder="The quotation…"
                        aria-label={`Quote ${i + 1}`}
                        className="border-transparent bg-transparent px-2 font-serif text-[1.1rem] italic hover:border-rule"
                      />
                      <Input
                        value={block.cite ?? ""}
                        onChange={(e) => update(i, { ...block, cite: e.target.value })}
                        placeholder="Who said it (optional)"
                        aria-label="Quote attribution"
                        className="h-9 border-transparent bg-transparent px-2 text-[0.85rem] hover:border-rule"
                      />
                    </div>
                  )}
                  {block.type === "list" && (
                    <Textarea
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      autoGrow
                      rows={3}
                      value={block.items.join("\n")}
                      onChange={(e) => update(i, { ...block, items: e.target.value.split("\n") })}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && e.currentTarget.value === "" && value.length > 1) {
                          e.preventDefault();
                          remove(i);
                        }
                      }}
                      placeholder={"One item per line\nSecond item"}
                      aria-label={`List ${i + 1}`}
                      className="border-transparent bg-transparent px-2 hover:border-rule"
                    />
                  )}
                  {block.type === "image" && (
                    <div className="grid gap-2">
                      <MediaUploader
                        kind="image"
                        preview="single"
                        compact
                        folder={folder}
                        value={block.src ? { url: block.src, path: block.path ?? null } : null}
                        onChange={(v) => update(i, { ...block, src: v?.url ?? "", path: v?.path ?? undefined })}
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          value={block.caption ?? ""}
                          onChange={(e) => update(i, { ...block, caption: e.target.value })}
                          placeholder="Caption (optional)"
                          aria-label="Image caption"
                          className="h-10 text-[0.85rem]"
                        />
                        <Input
                          value={block.alt ?? ""}
                          onChange={(e) => update(i, { ...block, alt: e.target.value })}
                          placeholder="Alt text — describe the picture"
                          aria-label="Image alt text"
                          className="h-10 text-[0.85rem]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover actions (always visible on touch) */}
                <div className="flex shrink-0 flex-col gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                  <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp /></IconBtn>
                  <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}><ArrowDown /></IconBtn>
                  <IconBtn label="Duplicate" onClick={() => duplicate(i)}><Copy /></IconBtn>
                  <IconBtn label="Delete block" onClick={() => remove(i)} danger><Trash2 /></IconBtn>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2 border-t border-rule px-3 py-3">
        <AddMenu at={value.length} />
        {value.length === 0 && <span className="font-sans text-[0.8rem] text-muted">or paste a whole article above</span>}
      </div>

      <DialogRoot open={pasteOpen} onOpenChange={setPasteOpen}>
        <DialogContent
          title="Paste an article"
          description="Paste the whole text. Blank lines become paragraph breaks; you can add headings, quotes and images afterwards."
          className="max-w-2xl"
          footer={
            <>
              <Button variant="ghost" onClick={() => setPasteOpen(false)}>Cancel</Button>
              <Button onClick={applyPaste} disabled={!pasteText.trim()}>
                Add {splitArticle(pasteText).length || ""} paragraph{splitArticle(pasteText).length === 1 ? "" : "s"}
              </Button>
            </>
          }
        >
          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={12}
            autoFocus
            placeholder="Paste here…"
            className="mt-4 font-sans text-[0.95rem]"
            aria-label="Article text"
          />
          {value.some((b) => b.type !== "p" || b.text.trim()) && (
            <div className="mt-3 flex flex-wrap gap-4 font-sans text-[0.85rem] text-ink">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="paste-mode" checked={pasteMode === "append"} onChange={() => setPasteMode("append")} className="accent-[#E8862A]" />
                Add after existing blocks
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="paste-mode" checked={pasteMode === "replace"} onChange={() => setPasteMode("replace")} className="accent-[#E8862A]" />
                Replace the body
              </label>
            </div>
          )}
        </DialogContent>
      </DialogRoot>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip content={label} side="left">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 disabled:opacity-30 [&>svg]:h-4 [&>svg]:w-4",
          danger ? "hover:text-breaking" : "hover:text-ink",
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}
