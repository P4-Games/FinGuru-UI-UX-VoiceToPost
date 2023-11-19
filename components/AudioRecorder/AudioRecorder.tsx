"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import encodeWAV from "audiobuffer-to-wav";
import { IconLoader2 } from "@tabler/icons-react";
import AudioButton, { ReturnIcon } from "./AudioButton";
import { AnimatePresence, motion } from "framer-motion";
const maxWidth = 100 / (5 * 60);

export default function AudioRecorder({
  callBack,
}: Readonly<{
  callBack: (note: string) => void;
}>) {
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>();
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [barWidth, setBarWidth] = useState(0);
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const getFormatedDate = () => {
    let date = new Date();
    let opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    let formattedDate = date
      .toLocaleString("en-GB", opts)
      .replace(/\/|\s/g, "-")
      .replace(",", "");
    return formattedDate;
  };

  const handleSend = async () => {
    startProgress();
    setMessage(
      "Estamos procesando tu audio, esto puede tardar hasta 4 minutos..."
    );
    setLoading(true);
    if (file !== null) {
      if (file.size > 26214400) {
        // Check if the size exceeds 25MB
        setMessage("The audio file size exceeds the maximum limit of 25MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      // seting file with the original name
      formData.set("file", file);
      sendForm(formData);
    } else {
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
              // seting file name with timestamp to prevent overwriting
              formData.set(
                "file",
                wavBlob,
                "recorded-note-" + getFormatedDate() + ".wav"
              );
              sendForm(formData);
            });
        }
      };
      reader.readAsArrayBuffer(blob);
    }
  };

  const sendForm = async (formData: FormData) => {
    // Send the formData to the backend
    console.log(formData.get("file"));
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
      if (typeof data != "string") return;
      let formattedData = data?.startsWith("html")
        ? data.replace("html", "")
        : data;
      formattedData = formattedData.replaceAll(/\n/g, "<br/>");
      console.log(formattedData + " -- From Audio"); 
      callBack(formattedData + " -- From Audio");
    } catch (err) {
      setMessage("Ocurrió un error al procesar el audio");
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <section className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-4 m-8 h-full">
        <AnimatePresence>
          {
            !file ? <motion.div
              className="my-6 text-center"
              initial={{ opacity: 0, height: 'auto' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2 className="font-medium text-3xl mb-4">{
                audioURL ? "Vista previa" : "Grabar audio"
              }</h2>
              <AudioButton 
                mediaRecorderRef={mediaRecorderRef}
                audioChunksRef={audioChunksRef}
                setAudioURL={setAudioURL}
                audioURL={audioURL}
              />
            </motion.div> : null
          }
        </AnimatePresence>
        <AnimatePresence>
          {
            !audioURL ? <motion.div 
              className="my-6 text-center"
              initial={{ opacity: 0, height: 'auto' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
            <label
              className="block font-medium text-2xl mb-4"
              htmlFor="file_input"
            >
              Subir audio
            </label>
            <input
              className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              mp3, mp4, m4a y wav (MAX. 25MB).
            </p>
          </motion.div> : null
          }
        </AnimatePresence>
        <Button
          className="text-xl px-12 py-8 mt-12 w-full"
          onClick={handleSend}
          disabled={!(audioURL || file) || loading}
        >
          {loading ? (
            <div className="animate-spin">
              <IconLoader2 />
            </div>
          ) : (
            <div className="flex flex-row items-center gap-4">
            Enviar y procesar
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M17.174 3.21582C17.0471 3.05402 16.8987 2.91008 16.7328 2.78793C16.3658 2.5177 15.7956 2.40792 14.6345 2.62518C13.4793 2.84133 11.949 3.33697 9.81197 4.03142L8.64277 4.41136C6.63988 5.06222 5.19647 5.53232 4.18845 5.97951C3.14977 6.4403 2.78905 6.78975 2.67073 7.07402C2.50187 7.47974 2.47484 7.92995 2.59398 8.3527C2.67745 8.64891 2.99382 9.03843 3.97003 9.61845C4.83577 10.1328 6.06022 10.7091 7.72301 11.478L10.4809 8.73969C10.7779 8.44484 11.2594 8.44484 11.5563 8.73969C11.8533 9.03454 11.8533 9.51259 11.5563 9.80745L8.79841 12.5457C9.52347 14.0914 10.0682 15.2331 10.5497 16.0481C11.0974 16.9752 11.4601 17.2891 11.7247 17.3806C12.2378 17.5582 12.802 17.5182 13.2845 17.2701C13.5334 17.1421 13.8474 16.7804 14.257 15.7854C14.6533 14.8228 15.0688 13.4577 15.6433 11.5661L16.0841 10.1146C16.7332 7.97713 17.1964 6.44653 17.387 5.29483C17.5785 4.13719 17.4546 3.57378 17.174 3.21582ZM7.31212 12.9537C8.08156 14.5959 8.68978 15.8845 9.23787 16.8121C9.79565 17.7562 10.3957 18.5199 11.2242 18.8065C12.1321 19.1207 13.1302 19.05 13.9839 18.611C14.763 18.2104 15.2477 17.3699 15.6648 16.3568C16.0919 15.3193 16.5276 13.8846 17.0863 12.0449L17.5577 10.4929C18.1855 8.42558 18.6791 6.80044 18.8877 5.53964C19.0973 4.27308 19.0595 3.16234 18.374 2.28817C18.1625 2.01851 17.9152 1.7786 17.6387 1.57503C16.7424 0.915109 15.6232 0.903568 14.3528 1.14128C13.0882 1.3779 11.4634 1.9059 9.39655 2.57756L8.12265 2.99153C6.1767 3.62387 4.65726 4.11762 3.56804 4.60084C2.50073 5.07433 1.62801 5.62553 1.26517 6.4973C0.96641 7.21511 0.918598 8.01163 1.12938 8.75958C1.38537 9.66798 2.18597 10.3182 3.18908 10.9142C4.17446 11.4997 5.55445 12.1418 7.31212 12.9537Z" fill="#f9f9f9"/>
            </svg>
            </div>
          )} 
        </Button>
        <Button
          className="text-xl px-12 py-8 w-full flex items-center justify-center gap-4"
          variant={"secondary"}
          onClick={() => {
            setAudioURL("");
            setFile(null);
          }}
        >
          <ReturnIcon /> Volver a empezar
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
