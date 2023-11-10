import React from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap";

interface NoteSectionProps{
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}
export default function NoteSection({ note, setNote}: NoteSectionProps) {
  const handlePublishNote = async () => {
    // handle publish note
  };

  return (
    <section className="flex flex-col gap-6 w-full justify-center align-middle">
      <Tiptap 
        note={note}
        setNote={setNote}
      />
      <div className="flex justify-center">
        <Button
          className="text-xl px-12 py-6"
          onClick={handlePublishNote}
          disabled={!note}
        >
          Publish note
        </Button>
      </div>
    </section>
  );
}
