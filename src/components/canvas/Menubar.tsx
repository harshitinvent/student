import "./Menubar.css";
import React from "react";
import { Editor, useEditorState } from "@tiptap/react";

// ---------------- React Icons ---------------
import { FaBold, FaItalic, FaStrikethrough, FaUndo, FaRedo } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { IoCodeSlashSharp } from "react-icons/io5";
import { BiCodeBlock } from "react-icons/bi";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false,
          canBold: false,
          isItalic: false,
          canItalic: false,
          isStrike: false,
          canStrike: false,
          isHeading1: false,
          isHeading2: false,
          isBulletList: false,
          isOrderedList: false,
          isCode: false,
          isCodeBlock: false,
          canCode: false,
          canUndo: false,
          canRedo: false,
        };
      }

      return {
        isBold: ctx.editor.isActive("bold"),
        canBold: ctx.editor.can().chain().toggleBold().run(),
        isItalic: ctx.editor.isActive("italic"),
        canItalic: ctx.editor.can().chain().toggleItalic().run(),
        isStrike: ctx.editor.isActive("strike"),
        canStrike: ctx.editor.can().chain().toggleStrike().run(),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isCode: ctx.editor.isActive("code"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        canCode: ctx.editor.can().chain().toggleCode().run(),
        canUndo: ctx.editor.can().chain().undo().run(),
        canRedo: ctx.editor.can().chain().redo().run(),
      };
    },
  });

  if (!editor) return null;

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          className={`tiptap-fixed-menu-button ${editorState?.isBold ? "is-active" : ""}`}
        >
          <FaBold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          className={`tiptap-fixed-menu-button ${editorState?.isItalic ? "is-active" : ""}`}
        >
          <FaItalic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          className={`tiptap-fixed-menu-button ${editorState?.isStrike ? "is-active" : ""}`}
        >
          <FaStrikethrough size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`tiptap-fixed-menu-button ${editorState?.isHeading1 ? "is-active" : ""}`}
        >
          <b style={{ fontSize: "16px" }}>H1</b>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tiptap-fixed-menu-button ${editorState?.isHeading2 ? "is-active" : ""}`}
        >
          <b style={{ fontSize: "16px" }}>H2</b>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tiptap-fixed-menu-button ${editorState?.isBulletList ? "is-active" : ""}`}
        >
          <MdFormatListBulleted size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tiptap-fixed-menu-button ${editorState?.isOrderedList ? "is-active" : ""}`}
        >
          <GoListOrdered size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState?.canCode}
          className={`tiptap-fixed-menu-button ${editorState?.isCode ? "is-active" : ""}`}
        >
          <IoCodeSlashSharp size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`tiptap-fixed-menu-button ${editorState?.isCodeBlock ? "is-active" : ""}`}
        >
          <BiCodeBlock size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="tiptap-fixed-menu-button"
          disabled={!editorState?.canUndo}
        >
          <FaUndo size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="tiptap-fixed-menu-button"
          disabled={!editorState?.canRedo}
        >
          <FaRedo size={16} />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
