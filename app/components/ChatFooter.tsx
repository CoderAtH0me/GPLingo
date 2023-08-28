"use client";

import axios from "axios";

import { useState, useRef, useCallback, useTransition } from "react";

import { useRouter } from "next/navigation";

import { transcribeAudio } from "@/app/utils/server-actions";

import { getSpeechTokenOrRefresh } from "../utils";

import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

import Button from "./Button";

import Locale from "@/app/locales";
import { changeLang, AllLangs } from "@/app/locales";

interface ChatFooterProps {
  onSendMessage: (message: string, systemPrompt: string) => void;
  isLoading: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const [recording, setRecording] = useState<boolean>(false);

  let [isPending, startTransition] = useTransition();

  const recognizer = useRef<speechsdk.SpeechRecognizer | null>(null);

  const audioChunks = useRef<Array<Blob>>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const router = useRouter();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleSystemPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSystemPrompt(e.target.value);
  };

  const handleSendClick = async () => {
    try {
      onSendMessage(message, systemPrompt);
      setMessage("");
      router.refresh();
    } catch (err) {
      console.log(err);
      setMessage("");
    }
  };

  const handleVoiceClick = async () => {
    if (!recording) {
      // Start recording
      if (navigator.mediaDevices && window.MediaRecorder) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
              audioChunks.current.push(e.data);
            };
            mediaRecorder.current.start();
            mediaRecorder.current.onstop = async () => {
              const audioBlob = new Blob(audioChunks.current, {
                type: "audio/wav",
              });
              const audioFile = new File([audioBlob], "audio.wav", {
                type: "audio/wav",
              });

              // Transcribe the audio using OpenAI's Whisper model
              try {
                const formData = new FormData();
                formData.append("file", audioFile);
                if (audioFile)
                  startTransition(async () => {
                    const res = await transcribeAudio(formData);
                    console.log(res);
                  });
              } catch (error) {
                console.error("Error transcribing audio:", error);
              }

              // Clear the audio chunks and stop all tracks
              audioChunks.current = [];
              stream.getTracks().forEach((track) => track.stop());
              setRecording(false);
            };
          })
          .catch((err) => console.error(err));
      }
    } else {
      // Stop recording
      mediaRecorder.current?.stop();
    }
    setRecording(!recording);
  };

  const changeLanguage = () => {
    const [en] = AllLangs;

    changeLang(en);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div>
          <Button
            onClick={handleSendClick}
            disabled={isLoading}
            label={isLoading ? Locale.Sending : Locale.Send}
          />

          <Button
            onClick={handleVoiceClick}
            disabled={isLoading}
            label={recording ? "Stop" : "Voice"}
          />

          <Button onClick={changeLanguage} disabled={isLoading} label="to EN" />
        </div>
        <p>System Prompt</p>
        <textarea
          className="p-4 border m-4 w-full flex-auto focus:outline-none"
          name=""
          onChange={handleSystemPromptChange}
          id=""
          value={systemPrompt}
          cols={30}
          rows={2}
        ></textarea>
        <p>Input Prompt</p>

        <textarea
          className="p-4 border m-4 w-full flex-auto focus:outline-none"
          name=""
          onChange={handleTextChange}
          id=""
          value={message}
          cols={30}
          rows={5}
        ></textarea>
      </div>
    </>
  );
};

export default ChatFooter;
