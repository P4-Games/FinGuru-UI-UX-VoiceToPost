"use client";
import React, { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";
import NoteSection from "@/components/NoteSection";
import { Navbar } from "@/components/Navbar";

export default function NoteRecord() {
  const [note, setNote] = useState("");

  return (
    <>
      <Navbar />
      <main className="w-full h-full flex flex-col items-center">
        <AudioRecorder callBack={setNote} />
        <NoteSection note={note} />
      </main>
    </>
  );
}
