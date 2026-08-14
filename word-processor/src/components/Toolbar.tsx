import { useCallback, useState } from "react";
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
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  QuoteIcon,
  RedoIcon,
  StrikeIcon,
  TableIcon,
  UnderlineIcon,
  UndoIcon,
} from "./icons";
import "./Toolbar.css";

const TEXT_COLORS = ["#1f2023", "#d1453a", "#c9760b", "#1f8a4c", "#3a6df0", "#8047d6"];
const HIGHLIGHT_COLORS = ["#fff2a8", "#c8f2c2", "#c2e4ff", "#ffd0e0", "#e6d6ff"];

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

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return <div className="toolbar" aria-hidden />;

  const blockValue = currentBlockValue(editor);

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
        <ToolbarButton label="Insert image" onClick={addImage}>
          <ImageIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Insert table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon />
        </ToolbarButton>
      </div>
    </div>
  );
}
