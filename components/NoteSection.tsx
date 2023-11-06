import React from "react";
import { Button } from "@/components/ui/button";

export default function NoteSection({ note }: { note: string }) {
  const handlePublishNote = async () => {
    // handle publish note
  };
  return (
    <section className="flex flex-col gap-6 w-full justify-center align-middle">
      <div className="border border-gray-500 p-8 max-w-3xl w-full h-[40vh] overflow-y-auto mx-auto">
        <p>{note ? note : "..."}</p>
      </div>
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
