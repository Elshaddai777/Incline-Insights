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
import "./App.css";

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
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: initialDoc.content,
    autofocus: "end",
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
