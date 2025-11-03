import React, { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import MenuBar from "./Menubar";

interface TiptapProps {
  value?: string;
  onChange: (value: string) => void;
  onEnterPress: () => void;
}

const Tiptap: React.FC<TiptapProps> = ({ value = "", onChange, onEnterPress }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    autofocus: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // send HTML instead of plain text
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onEnterPress();
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);
    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onEnterPress]);

  // Sync editor content when value prop changes (e.g., when clearing after send)
  useEffect(() => {
    if (!editor || value === undefined) return;
    
    const currentContent = editor.getHTML();
    if (currentContent !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className="message-input tiptap-container">
      {/* ✅ FIXED MENU BAR */}
      {editor && <MenuBar editor={editor as Editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
