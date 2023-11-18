"use client";

import BubbleMenu from "@tiptap/extension-bubble-menu";
import {
  useEditor,
  EditorContent,
  BubbleMenu as BubbleMenuComp,
  EditorProvider,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ButtonAltClassName, ButtonClassName } from "./Article";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { TiptapMenuBar } from "./TipTapMenuBar";
import React, { useEffect } from "react";
import { Input } from "./ui/input";

interface TiptapProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}
const Tiptap = ({ note, setNote }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      BubbleMenu.configure({
        element:
          typeof document !== "undefined"
            ? (document.querySelector(".tiptap_menu") as HTMLElement)
            : null,
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] } as any),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: "Escribe aquí",
    onUpdate: ({ editor }) => {
      setNote(editor.getHTML());
    },
  });

  const ButtonClassNameExtended =
    ButtonClassName + " px-4 py-4 border-right-[2px solid #fff]";
  const ButtonAltClassNameExtended =
    ButtonAltClassName + " px-4 py-4 border-right-[2px solid #fff]";

  const getButtonClassName = (func: string): string =>
    editor?.isActive(func)
      ? ButtonClassNameExtended
      : ButtonAltClassNameExtended;

    useEffect(() => {
      if(note.endsWith("-- From Audio")){
        editor?.commands.setContent(note.replaceAll("-- From Audio", "").replaceAll("\n", ""));
      }
    }, [editor?.commands, note]);
  
  return (
    <section className="max-w-[1020px] mx-auto">
      <TiptapMenuBar editor={editor} />
      <EditorContent className="tiptap_form" editor={editor} />
      {editor && (
        <BubbleMenuComp
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex flex-row flex-wrap items-center h-auto justify-start rounded-lg overflow-hidden"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={getButtonClassName("bold")}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={getButtonClassName("italic")}
          >
            italic
          </button>
        </BubbleMenuComp>
      )}
    </section>
  );
};

export default Tiptap;
