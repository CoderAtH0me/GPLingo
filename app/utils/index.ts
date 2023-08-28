import axios from "axios";

import toWav from "audiobuffer-to-wav";

import Cookie from "universal-cookie";

import { AxiosError } from "axios";

// export async function convertAudioBufferToWavFile(
//   audioBuffer: ArrayBuffer
// ): Promise<string> {
//   // Same conversion you're doing here...
//   if (typeof window !== "undefined") {
//     const audioContext = new window.AudioContext();
//     const buffer = await audioContext.decodeAudioData(audioBuffer);
//     const wav = toWav(buffer);
//     const blob = new Blob([wav], { type: "audio/wav" });

//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   }
//   return "";
// }

export async function getSpeechTokenOrRefresh() {
  const cookie = new Cookie();

  const speechToken = cookie.get("speech-token");

  if (speechToken === undefined) {
    try {
      const response = await axios.get("/api/get-speech-token");
      const token = response.data.token;
      const region = response.data.region;

      cookie.set("speech-token", region + ":" + token, {
        maxAge: 540,
        path: "/",
      });

      console.log("Token fetched from back-end: " + token);
      return { authToken: token, region: region };
    } catch (err) {
      const axiosError = err as AxiosError; // Cast error to AxiosError
      console.log(axiosError.response?.data); // Now TypeScript will not complain
      return { authToken: null, error: axiosError.response?.data };
    }
  } else {
    console.log("Token fetched from cookie: " + speechToken);
    const idx = speechToken.indexOf(":");
    return {
      authToken: speechToken.slice(idx + 1),
      region: speechToken.slice(0, idx),
    };
  }
}

// pretty object for fetchEnventSource
export function prettyObject(msg: any) {
  const obj = msg;
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg, null, "  ");
  }
  if (msg === "{}") {
    return obj.toString();
  }
  if (msg.startsWith("```json")) {
    return msg;
  }
  return ["```json", msg, "```"].join("\n");
}
