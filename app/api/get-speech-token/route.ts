import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  console.log("CALLED TOKEN");
  if (
    speechKey === "paste-your-speech-key-here" ||
    speechRegion === "paste-your-speech-region-here"
  ) {
    return new Response(
      "You forgot to add your speech key or region to the .env file.",
      {
        status: 400,
      }
    );
  }

  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": speechKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.post(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      headers
    );

    return NextResponse.json({
      token: tokenResponse.data,
      region: speechRegion,
    });
  } catch (err) {
    console.log(err);
    return new Response("There was an error authorizing your speech key.", {
      status: 401,
    });
  }
}
