import { useEffect, useRef, useState } from "react";
import { EditorContent, type Editor } from "@tiptap/react";
import { CONTENT_HEIGHT_PX, MARGIN_PX, PAGE_WIDTH_PX } from "../pageMetrics";
import "./PageEditor.css";

interface PageEditorProps {
  editor: Editor | null;
}

export function PageEditor({ editor }: PageEditorProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const recalc = () => {
      const height = el.scrollHeight;
      setPageCount(Math.max(1, Math.ceil(height / CONTENT_HEIGHT_PX)));
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    return () => observer.disconnect();
  }, [editor]);

  const breaks = Array.from({ length: pageCount - 1 }, (_, i) => (i + 1) * CONTENT_HEIGHT_PX);

  return (
    <div className="page-scroll">
      <div className="paper" style={{ width: PAGE_WIDTH_PX }}>
        <div className="paper-content" ref={contentRef} style={{ padding: `${MARGIN_PX}px` }}>
          <EditorContent editor={editor} />
        </div>
        <div className="page-breaks" aria-hidden>
          {breaks.map((offset, i) => (
            <div
              key={offset}
              className="page-break-line"
              style={{ top: offset + MARGIN_PX }}
            >
              <span className="page-break-label">Page {i + 2}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="page-count-footer">
        {pageCount} {pageCount === 1 ? "page" : "pages"}
      </div>
    </div>
  );
}
