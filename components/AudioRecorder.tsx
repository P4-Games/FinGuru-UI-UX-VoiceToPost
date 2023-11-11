"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import encodeWAV from "audiobuffer-to-wav";
import { IconLoader2 } from "@tabler/icons-react";

const maxWidth = 100 / (5 * 60);

export default function AudioRecorder({
  callBack,
}: {
  callBack: (note: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>();
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [barWidth, setBarWidth] = useState(0);

  const startProgress = () => {
    let timer = setInterval(() => {
      setBarWidth((prevWidth) => {
        if (prevWidth < 100) {
          return prevWidth + maxWidth;
        } else {
          clearInterval(timer);
          return prevWidth;
        }
      });
    }, 1000);

    // Stop the timer after 5 minutes
    setTimeout(() => {
      clearInterval(timer);
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    setBarWidth(0);
  }, [loading]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
      audioChunksRef.current.push(e.data);
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      const blob = new Blob(audioChunksRef.current, {
        type: "audio/ogg; codecs=opus",
      });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    });

    // Clear the previous recording data
    audioChunksRef.current = [];

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    startProgress();
    setMessage(
      "Estamos procesando tu audio, esto puede tardar hasta 4 minutos..."
    );
    setLoading(true);
    let blob = new Blob(audioChunksRef.current, {
      type: "audio/ogg; codecs=opus",
    });
    let reader = new FileReader();
    reader.onload = function (event) {
      if (event.target) {
        let audioData = new Uint8Array(event.target.result as ArrayBuffer);
        const audioContext = new window.AudioContext();
        audioContext
          .decodeAudioData(audioData.buffer)
          .then(async (audioBuffer) => {
            let wavArrayBuffer = encodeWAV(audioBuffer);
            let wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });

            if (wavBlob.size > 26214400) {
              // Check if the size exceeds 25MB
              setMessage(
                "The audio file size exceeds the maximum limit of 25MB."
              );
              setLoading(false);
              return;
            }

            const formData = new FormData();
            formData.append("file", wavBlob, "recorded-note.wav");

            // Send the formData to your backend
            try {
              const response = await fetch(
                "https://finguru-back-voicetopost-qj44in647a-uc.a.run.app" +
                  "/convert_audio",
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await response.json();
              setMessage("");
              setLoading(false);

              console.log(data);
              if (typeof data != "string") return;
              let formattedData = data?.startsWith("html")
                ? data.replace("html", "")
                : data;
              formattedData = formattedData.replace(/\n/g, "<br />");
              callBack(formattedData);
            } catch (err) {
              setMessage("Ocurrió un error al procesar el audio");
              setLoading(false);
              console.log(err);
            }
          });
      }
    };
    reader.readAsArrayBuffer(blob);
  };

  return (
    <section className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-4 m-8">
        <div className="flex gap-4">
          {isRecording ? (
            <button
              onClick={handlePauseRecording}
              className="mx-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
            >
              <svg
                className="h-12 w-12"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="mx-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
            >
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
              >
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            </button>
          )}
        </div>
        <audio src={audioURL} controls />
        <Button
          className="text-xl px-12 py-6"
          onClick={handleSend}
          disabled={!audioURL || loading}
        >
          {loading ? (
            <div className="animate-spin">
              <IconLoader2 />
            </div>
          ) : (
            "Enviar audio"
          )}
        </Button>
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div
              style={{ width: `${barWidth}%` }}
              className="bg-gray-600 h-2.5 rounded-full dark:bg-gray-300"
            ></div>
          </div>
        )}
        {message && <p className="font-semibold">{message}</p>}
      </div>
    </section>
  );
}
