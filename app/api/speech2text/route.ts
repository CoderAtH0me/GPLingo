import { NextRequest, NextResponse } from "next/server";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

if (!process.env.SPEECH_KEY || !process.env.SPEECH_REGION) {
  throw new Error("Missing environment variables");
}
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";

// We should add a pushStream type here which is capable of receiving streaming data
const pushStream = sdk.AudioInputStream.createPushStream();

// Pass push stream to audio config
const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

// Pass speech config and audio config to speech recognizer
const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

export async function POST(request: NextRequest) {
  const parsedReq = await request.json();

  //   const audioFile = await readAsArrayBuffer(parsedReq.audioBuffer);
  const audioFileBuffer = Buffer.from(parsedReq.audioBuffer, "base64");

  // write data to push stream
  pushStream.write(audioFileBuffer);

  // Make the recognizer recognize the speech in the audio
  console.log(recognizer);
  recognizer.recognizeOnceAsync(
    (result) => {
      console.log(`RECOGNIZED: Text=${result.text}`);
      pushStream.close();
      recognizer.close();
      return NextResponse.json({ data: result.text });
    },
    (err) => {
      console.log(`ERROR: ${err}`);
      recognizer.close();
      //  recognizer = undefined;
      throw err;
    }
  );
  return NextResponse.json("hello");
}
