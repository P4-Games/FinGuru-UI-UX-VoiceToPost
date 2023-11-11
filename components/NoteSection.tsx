import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap";
import { IconLoader2 } from "@tabler/icons-react";
interface NoteSectionProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}
export default function NoteSection({ note, setNote }: NoteSectionProps) {
  const [loading, setLoading] = useState(false);

  const handlePublishNote = async () => {
    // handle publish note
  };

  return (
    <section className="flex flex-col gap-6 w-full justify-center align-middle">
      <Tiptap note={note} setNote={setNote} />
      <div className="flex justify-center">
        <Button
          className="text-xl px-12 py-6"
          onClick={handlePublishNote}
          disabled={!note || loading}
        >
          {loading ? (
            <div className="animate-spin">
              <IconLoader2 />
            </div>
          ) : (
            "Publicar Nota"
          )}
        </Button>
      </div>
    </section>
  );
}
