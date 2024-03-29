"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./AudioRecorder.module.scss";

interface AudioButtonProps {
  audioURL: string;
  setAudioURL: React.Dispatch<React.SetStateAction<string>>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null | undefined>;
  audioChunksRef: React.MutableRefObject<BlobPart[]>;
}

export const MicrophoneIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00867 6.20655C8.55973 6.20655 8.19579 6.57113 8.19579 7.02085C8.19579 7.47058 8.55973 7.83515 9.00867 7.83515H10.9913C11.4403 7.83515 11.8042 7.47058 11.8042 7.02085C11.8042 6.57113 11.4403 6.20655 10.9913 6.20655H9.00867Z"
      fill="#303030"
    />
    <path
      d="M8.51301 8.68918C8.06407 8.68918 7.70012 9.05375 7.70012 9.50348C7.70012 9.9532 8.06407 10.3178 8.51301 10.3178H11.487C11.9359 10.3178 12.2999 9.9532 12.2999 9.50348C12.2999 9.05375 11.9359 8.68918 11.487 8.68918H8.51301Z"
      fill="#303030"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0C8.03698 0 6.53097 0.693023 5.55232 2.06999C4.60918 3.397 4.23048 5.25769 4.23048 7.45896C4.23048 9.66323 4.61052 11.6184 5.5343 13.0453C6.49026 14.522 7.98779 15.3658 10 15.3658C12.0122 15.3658 13.5097 14.522 14.4657 13.0453C15.3895 11.6184 15.7695 9.66323 15.7695 7.45896C15.7695 5.25769 15.3908 3.397 14.4477 2.06999C13.469 0.693023 11.963 0 10 0ZM6.78717 2.91961C7.43517 2.00787 8.43728 1.48256 10 1.48256C11.5627 1.48256 12.5648 2.00787 13.2128 2.91961C13.8963 3.88123 14.2627 5.37938 14.2627 7.45896C14.2627 9.53556 13.8976 11.1632 13.1948 12.2488C12.5242 13.2847 11.5136 13.8832 10 13.8832C8.48637 13.8832 7.47583 13.2847 6.80519 12.2488C6.10238 11.1632 5.7373 9.53556 5.7373 7.45896C5.7373 5.37938 6.10372 3.88123 6.78717 2.91961Z"
      fill="#303030"
    />
    <path
      d="M2.74916 7.94439C2.33277 7.94439 2 8.29579 2 8.72322C2 10.2183 2.28251 12.507 3.42412 14.4492C4.49885 16.2777 6.31034 17.7488 9.18711 17.9817V19.1857C9.18711 19.6354 9.55105 20 10 20C10.4489 20 10.8129 19.6354 10.8129 19.1857V17.9841C13.666 17.7702 15.4835 16.4233 16.5699 14.6366C17.7216 12.7425 18 10.4424 18 8.72322C18 8.29579 17.6672 7.94439 17.2508 7.94439C16.8344 7.94439 16.5017 8.29579 16.5017 8.72322C16.5017 10.3142 16.2363 12.27 15.3034 13.8043C14.4055 15.281 12.8382 16.4562 10 16.4562C7.18926 16.4562 5.61408 15.1877 4.70263 13.637C3.75962 12.0326 3.49832 10.0654 3.49832 8.72322C3.49832 8.29579 3.16555 7.94439 2.74916 7.94439Z"
      fill="#303030"
    />
  </svg>
);

export const PauseIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8319 6.95369C11.4141 6.95369 11.0754 7.29236 11.0754 7.71012V12.2899C11.0754 12.7076 11.4141 13.0463 11.8319 13.0463C12.2496 13.0463 12.5883 12.7076 12.5883 12.2899V7.71012C12.5883 7.29236 12.2496 6.95369 11.8319 6.95369Z"
      fill="#f9f9f9"
    />
    <path
      d="M8.1681 6.95369C7.75034 6.95369 7.41168 7.29236 7.41168 7.71012V12.2899C7.41168 12.7076 7.75034 13.0463 8.1681 13.0463C8.58587 13.0463 8.92453 12.7076 8.92453 12.2899V7.71012C8.92453 7.29236 8.58587 6.95369 8.1681 6.95369Z"
      fill="#f9f9f9"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1ZM2.51285 10C2.51285 5.86496 5.86496 2.51285 10 2.51285C14.135 2.51285 17.4872 5.86496 17.4872 10C17.4872 14.135 14.135 17.4872 10 17.4872C5.86496 17.4872 2.51285 14.135 2.51285 10Z"
      fill="#f9f9f9"
    />
  </svg>
);

export const PlayIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.79983 6.69443C9.40054 6.49179 8.94091 6.32836 8.45056 6.45049C8.12949 6.53045 7.83484 6.6963 7.5963 6.93101C7.23246 7.289 7.11756 7.77431 7.0671 8.22957C7.01713 8.68049 7.01715 9.26228 7.01717 9.9554V10.0442C7.01715 10.7373 7.01713 11.3191 7.0671 11.77C7.11756 12.2253 7.23246 12.7106 7.5963 13.0686C7.83484 13.3033 8.12949 13.4692 8.45056 13.5491C8.94091 13.6712 9.40054 13.5078 9.79983 13.3052C10.1952 13.1045 10.6703 12.7898 11.2358 12.4151L11.3071 12.3679C11.795 12.0447 12.211 11.7692 12.5148 11.5135C12.8283 11.2498 13.1261 10.9247 13.2371 10.4673C13.3116 10.1604 13.3116 9.83926 13.2371 9.5323C13.1261 9.07488 12.8283 8.74986 12.5148 8.48607C12.211 8.23043 11.7951 7.95492 11.3071 7.63172L11.2359 7.58451C10.6703 7.20981 10.1952 6.89507 9.79983 6.69443ZM8.56326 7.9684C8.624 7.90863 8.69878 7.86664 8.77994 7.84643C8.78083 7.8462 8.78587 7.84493 8.79712 7.84502C8.80926 7.84512 8.82935 7.84682 8.85987 7.8537C8.92127 7.86755 9.02205 7.90176 9.18066 7.98226C9.49561 8.14209 9.90335 8.41085 10.5148 8.81587C11.0467 9.16827 11.3943 9.39986 11.6291 9.59735C11.8592 9.79101 11.8784 9.87063 11.8806 9.8798C11.8997 9.95858 11.8997 10.0413 11.8806 10.12C11.8784 10.1292 11.8592 10.2086 11.6291 10.4023C11.3943 10.5997 11.0467 10.8313 10.5148 11.1837C9.90335 11.5888 9.49561 11.8575 9.18066 12.0174C9.02205 12.0978 8.92127 12.1321 8.85987 12.1459C8.82935 12.1528 8.80926 12.1545 8.79712 12.1546C8.78555 12.1547 8.78062 12.1534 8.77994 12.1532C8.69878 12.133 8.62395 12.0909 8.56321 12.0312C8.56243 12.0304 8.5585 12.0265 8.55226 12.0164C8.54558 12.0054 8.53595 11.9868 8.52497 11.9563C8.50287 11.8951 8.47623 11.7888 8.45615 11.6075C8.41628 11.2478 8.41518 10.7487 8.41518 9.9998C8.41518 9.25094 8.41628 8.75185 8.45615 8.39209C8.47623 8.21083 8.50287 8.10454 8.52497 8.04328C8.53595 8.01281 8.54558 7.99416 8.55226 7.98326C8.5585 7.97307 8.56247 7.96917 8.56326 7.9684Z"
      fill="#303030"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1ZM2.51285 10C2.51285 5.86496 5.86496 2.51285 10 2.51285C14.135 2.51285 17.4872 5.86496 17.4872 10C17.4872 14.135 14.135 17.4872 10 17.4872C5.86496 17.4872 2.51285 14.135 2.51285 10Z"
      fill="#303030"
    />
  </svg>
);

export const StopIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10ZM8.38845 6.59533C8.81189 6.5384 9.34072 6.53843 9.95442 6.53846H10.0456C10.6593 6.53843 11.1881 6.5384 11.6115 6.59533C12.0654 6.65635 12.5004 6.79394 12.8532 7.14678C13.2061 7.49963 13.3437 7.93464 13.4047 8.38846C13.4616 8.81192 13.4616 9.34071 13.4615 9.95443V10.0456C13.4616 10.6593 13.4616 11.1881 13.4047 11.6116C13.3437 12.0654 13.2061 12.5004 12.8532 12.8532C12.5004 13.2061 12.0654 13.3437 11.6115 13.4047C11.1881 13.4616 10.6593 13.4616 10.0456 13.4615H9.95442C9.3407 13.4616 8.81191 13.4616 8.38845 13.4047C7.93463 13.3437 7.49962 13.2061 7.14677 12.8532C6.79393 12.5004 6.65634 12.0654 6.59532 11.6116C6.53839 11.1881 6.53842 10.6593 6.53845 10.0456V9.95438C6.53842 9.34068 6.53839 8.8119 6.59532 8.38846C6.65634 7.93464 6.79393 7.49963 7.14677 7.14678C7.49962 6.79394 7.93463 6.65635 8.38845 6.59533Z"
      fill="#f9f9f9"
    />
  </svg>
);

export const ReturnIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3114 2.96587C12.3659 2.96587 14.2159 3.84432 15.5041 5.24756L13.3601 5.08804C12.8181 5.04771 12.3459 5.45388 12.3056 5.99524C12.2652 6.5366 12.6719 7.00815 13.2139 7.04848L17.4025 7.36012C17.6658 7.37971 17.926 7.29279 18.1245 7.11889C18.3231 6.94499 18.4433 6.6987 18.4582 6.43539L18.6984 2.19201C18.7291 1.65001 18.3141 1.1858 17.7714 1.15515C17.2287 1.12451 16.7639 1.53904 16.7332 2.08103L16.6472 3.60028C15.02 1.99328 12.7823 1 10.3114 1C5.33456 1 1.30003 5.02944 1.30003 10C1.30003 14.9706 5.33456 19 10.3114 19C12.5044 19 14.5168 18.2164 16.0792 16.9152C16.4967 16.5676 16.5529 15.9477 16.2048 15.5308C15.8567 15.1139 15.2361 15.0577 14.8187 15.4054C13.5969 16.4228 12.0269 17.0341 10.3114 17.0341C6.42166 17.0341 3.26839 13.8848 3.26839 10C3.26839 6.11516 6.42166 2.96587 10.3114 2.96587Z"
      fill="#201F29"
    />
  </svg>
);

export default function AudioButton({
  audioURL,
  setAudioURL,
  mediaRecorderRef,
  audioChunksRef,
}: Readonly<AudioButtonProps>) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<any>();

  // useEffect(() => {
  //   // dynamically import audio-recorder because it uses window object

  //   loadRecorder();
  // }, []);

  const loadRecorder = async () => {
    const AudioRecorder = (await import("audio-recorder-polyfill")).default;
    if (typeof window !== "undefined") {
      window.MediaRecorder = AudioRecorder;
      console.log(window.MediaRecorder);
    }
  };

  const handleStartRecording = async () => {
    await loadRecorder();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
      audioChunksRef.current.push(e.data);
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm;codecs=opus",
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

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    //audioRef.current.src = audioURL;
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(audioURL ?? "");
    }
    const currentAudioRef = audioRef.current;
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };
    currentAudioRef.addEventListener("ended", handleAudioEnd);

    return () => {
      currentAudioRef.removeEventListener("ended", handleAudioEnd);
    };
  }, [audioURL]);

  return (
    <div className="flex gap-4">
      {!audioURL ? (
        <>
          {isRecording ? (
            <button
              onClick={handlePauseRecording}
              className={"focus:outline-none " + styles.audioButtonActive}
            >
              <div>
                <StopIcon />
              </div>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className={"focus:outline-none " + styles.audioButton}
            >
              <div>
                <MicrophoneIcon />
              </div>
            </button>
          )}
        </>
      ) : (
        <button
          onClick={handlePlay}
          className={
            "focus:outline-none " +
            (isPlaying ? styles.audioButtonPlaying : styles.audioButton)
          }
        >
          <div>{isPlaying ? <PauseIcon /> : <PlayIcon />}</div>
        </button>
      )}
    </div>
  );
}
