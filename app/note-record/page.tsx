"use client";
import React, { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";
import NoteSection from "@/components/NoteSection";

export default function NoteRecord() {
  const [note, setNote] = useState("");

  return (
    <main className="w-full h-full flex flex-col items-center">
      <AudioRecorder callBack={setNote} />
      <NoteSection note={note} />
    </main>
  );
}
