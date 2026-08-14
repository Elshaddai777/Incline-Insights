import { useCallback, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BulletListIcon,
  ChevronDownIcon,
  ClearFormatIcon,
  HighlightIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  PencilIcon,
  QuoteIcon,
  RedoIcon,
  StrikeIcon,
  TableIcon,
  UnderlineIcon,
  UndoIcon,
  UploadImageIcon,
} from "./icons";
import { DrawingModal } from "./DrawingModal";
import { FONT_GROUPS } from "../fonts";
import { readFileAsDataUrl } from "../lib/imageFiles";
import "./Toolbar.css";

const TEXT_COLORS = ["#241f19", "#b0402f", "#c9760b", "#1f8a4c", "#2f6fb0", "#6a3fb0"];
const HIGHLIGHT_COLORS = ["#fdf0a8", "#c8f2c2", "#c2e4ff", "#ffd0e0", "#e6d6ff"];

const BLOCK_OPTIONS = [
  { value: "paragraph", label: "Normal text" },
  { value: "heading-1", label: "Heading 1" },
  { value: "heading-2", label: "Heading 2" },
  { value: "heading-3", label: "Heading 3" },
  { value: "blockquote", label: "Quote" },
] as const;

function currentBlockValue(editor: Editor): string {
  if (editor.isActive("heading", { level: 1 })) return "heading-1";
  if (editor.isActive("heading", { level: 2 })) return "heading-2";
  if (editor.isActive("heading", { level: 3 })) return "heading-3";
  if (editor.isActive("blockquote")) return "blockquote";
  return "paragraph";
}

interface ToolbarProps {
  editor: Editor | null;
}

interface ButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, label, children }: ButtonProps) {
  return (
    <button
      type="button"
      className={`tb-btn${active ? " is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SwatchPicker({
  colors,
  onPick,
  onClear,
  icon,
  label,
}: {
  colors: string[];
  onPick: (color: string) => void;
  onClear: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tb-swatch-wrap">
      <button
        type="button"
        className="tb-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        title={label}
      >
        {icon}
        <ChevronDownIcon />
      </button>
      {open && (
        <>
          <div className="tb-swatch-backdrop" onClick={() => setOpen(false)} />
          <div className="tb-swatch-popover">
            <button className="tb-swatch-clear" onClick={() => { onClear(); setOpen(false); }}>
              None
            </button>
            <div className="tb-swatch-grid">
              {colors.map((c) => (
                <button
                  key={c}
                  className="tb-swatch"
                  style={{ background: c }}
                  onClick={() => { onPick(c); setOpen(false); }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Toolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [drawingOpen, setDrawingOpen] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleFilesSelected = useCallback(
    async (files: FileList | null) => {
      if (!editor || !files || files.length === 0) return;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await readFileAsDataUrl(file);
        // Insert an empty paragraph right after the image so the cursor has a
        // text position to land on. Without it, an image at the end of the
        // doc leaves a NodeSelection on itself, and the *next* inserted
        // image silently replaces it instead of being added alongside it.
        editor
          .chain()
          .focus()
          .insertContent([
            { type: "image", attrs: { src: dataUrl, alt: file.name } },
            { type: "paragraph" },
          ])
          .run();
      }
    },
    [editor],
  );

  const insertDrawing = useCallback(
    (dataUrl: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent([
          { type: "image", attrs: { src: dataUrl, alt: "Drawing" } },
          { type: "paragraph" },
        ])
        .run();
    },
    [editor],
  );

  if (!editor) return <div className="toolbar" aria-hidden />;

  const blockValue = currentBlockValue(editor);
  const currentFont = (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <div className="tb-group">
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <UndoIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RedoIcon />
        </ToolbarButton>
      </div>

      <div className="tb-sep" />

      <div className="tb-group">
        <select
          className="tb-select"
          value={blockValue}
          aria-label="Paragraph style"
          onChange={(e) => {
            const value = e.target.value;
            const chain = editor.chain().focus();
            if (value === "paragraph") chain.setParagraph().run();
            else if (value === "heading-1") chain.toggleHeading({ level: 1 }).run();
            else if (value === "heading-2") chain.toggleHeading({ level: 2 }).run();
            else if (value === "heading-3") chain.toggleHeading({ level: 3 }).run();
            else if (value === "blockquote") chain.toggleBlockquote().run();
          }}
        >
          {BLOCK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="tb-select tb-select-font"
          value={currentFont}
          aria-label="Font family"
          style={{ fontFamily: currentFont || "var(--font-doc)" }}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") editor.chain().focus().unsetFontFamily().run();
            else editor.chain().focus().setFontFamily(value).run();
          }}
        >
          <option value="">Default</option>
          {FONT_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.fonts.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="tb-sep" />

      <div className="tb-group">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikeIcon />
        </ToolbarButton>
        <SwatchPicker
          label="Text color"
          icon={<BoldIcon style={{ color: editor.getAttributes("textStyle").color ?? undefined }} />}
          colors={TEXT_COLORS}
          onPick={(c) => editor.chain().focus().setColor(c).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
        />
        <SwatchPicker
          label="Highlight"
          icon={<HighlightIcon />}
          colors={HIGHLIGHT_COLORS}
          onPick={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
          onClear={() => editor.chain().focus().unsetHighlight().run()}
        />
        <ToolbarButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <ClearFormatIcon />
        </ToolbarButton>
      </div>

      <div className="tb-sep" />

      <div className="tb-group">
        <ToolbarButton
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRightIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustifyIcon />
        </ToolbarButton>
      </div>

      <div className="tb-sep" />

      <div className="tb-group">
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <OrderedListIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </ToolbarButton>
      </div>

      <div className="tb-sep" />

      <div className="tb-group">
        <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton label="Add a picture" onClick={() => fileInputRef.current?.click()}>
          <UploadImageIcon />
        </ToolbarButton>
        <ToolbarButton label="Draw something" onClick={() => setDrawingOpen(true)}>
          <PencilIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Insert table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            void handleFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <DrawingModal
        open={drawingOpen}
        onClose={() => setDrawingOpen(false)}
        onInsert={insertDrawing}
      />
    </div>
  );
}
