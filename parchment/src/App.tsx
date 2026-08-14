import { useEffect, useMemo, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";

import { TitleBar } from "./components/TitleBar";
import { Toolbar } from "./components/Toolbar";
import { PageEditor } from "./components/PageEditor";
import { loadDocument, useAutosaveDocument } from "./hooks/useAutosaveDocument";
import { readFileAsDataUrl } from "./lib/imageFiles";
import "./App.css";

function insertImageAt(view: import("@tiptap/pm/view").EditorView, pos: number, src: string) {
  const node = view.state.schema.nodes.image.create({ src });
  view.dispatch(view.state.tr.insert(pos, node));
}

function App() {
  const initialDoc = useMemo(() => loadDocument(), []);
  const [title, setTitle] = useState(initialDoc.title);
  const [content, setContent] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: "Start writing, or drop in a picture…" }),
    ],
    content: initialDoc.content,
    autofocus: "end",
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        const pos = coords ? coords.pos : view.state.selection.to;
        files.forEach((file) => {
          readFileAsDataUrl(file).then((src) => insertImageAt(view, pos, src));
        });
        return true;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        readFileAsDataUrl(file).then((src) =>
          insertImageAt(view, view.state.selection.to, src),
        );
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => setContent(editor.getHTML());
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && content === null) {
      setContent(editor.getHTML());
    }
  }, [editor, content]);

  const status = useAutosaveDocument(title, content);

  return (
    <div className="app-shell">
      <TitleBar
        title={title}
        onTitleChange={setTitle}
        status={status}
        onPrint={() => window.print()}
      />
      <Toolbar editor={editor} />
      <PageEditor editor={editor} />
    </div>
  );
}

export default App;
