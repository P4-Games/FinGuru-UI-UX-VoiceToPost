"use client";
import React, { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder/AudioRecorder";
import NoteSection from "@/components/NoteSection";
import { Navbar } from "@/components/Navbar";

export default function NoteRecord() {
  const [note, setNote] = useState<string>("");

  return (
    <>
      <Navbar />
      <main className="w-full h-full flex flex-col items-center">
        {
          note?.length === 0 ? <AudioRecorder callBack={setNote} /> : <NoteSection setNote={setNote} note={note} />
        }
      </main>
    </>
  );
}
