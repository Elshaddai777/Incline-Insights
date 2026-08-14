import type { SaveStatus } from "../hooks/useAutosaveDocument";
import "./TitleBar.css";

interface TitleBarProps {
  title: string;
  onTitleChange: (title: string) => void;
  status: SaveStatus;
  onPrint: () => void;
}

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: "Saved",
  saving: "Saving…",
  unsaved: "Unsaved changes",
};

export function TitleBar({ title, onTitleChange, status, onPrint }: TitleBarProps) {
  return (
    <div className="title-bar">
      <div className="title-bar-brand">Inkwell</div>
      <input
        className="title-bar-input"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Document title"
        spellCheck={false}
      />
      <div className="title-bar-right">
        <span className={`save-status save-status--${status}`}>{STATUS_LABEL[status]}</span>
        <button type="button" className="print-btn" onClick={onPrint}>
          Export PDF
        </button>
      </div>
    </div>
  );
}
