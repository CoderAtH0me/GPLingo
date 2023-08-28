"use server";

import axios from "axios";

import { currentUser } from "@clerk/nextjs";

import { getServerSideConfig } from "../config/server";

export async function transcribeAudio(formData: FormData): Promise<string> {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to use this feature");
  }
  const userLanguage = "Ukrainian";

  const serverConfig = getServerSideConfig();
  const { apiKey, baseUrl } = serverConfig;

  const claudeSuggestedPrompt = `I am a multilingual speech recognition system proficient in English and ${userLanguage}. When transcribing audio, I will identify words spoken in each language and transcribe them accurately in the same language. If I hear an English word I do not know how to translate to ${userLanguage}, I will write it using English letters. If I hear a ${userLanguage} word I do not know how to translate to English, I will write it using ${userLanguage} characters. My goal is to produce a bilingual transcription, writing English words in English and ${userLanguage} words in ${userLanguage}.`;
  const claudeSuggestedPrompt2 = `You are fluent in both English and ${userLanguage}. When transcribing a person's speech containing a mix of English and ${userLanguage} words, you will write down the English words using English spelling and the ${userLanguage} words using ${userLanguage} spelling. If the person says a English word you don't know the ${userLanguage} translation for, simply transcribe it in English. If they say a ${userLanguage} word you don't know the English translation for, simply transcribe it in ${userLanguage}. Your goal is to produce a bilingual transcription, accurately representing the original mixed English and ${userLanguage} speech.`;

  const prompt = `You are listening to non-English speaker,
   his native language is Ukrainian. User will try to speak English,
    but sometimes he will skip English word and replace it with Ukrainian one,
     so you have to transcribe mostly in English until you recognize 
     Ukrainian word. If I recognize Ukrainian I must transcribe in Ukrainian 
     right after English without any translations.`;

  const postProcessingPrompt = `You are working within the language learning application GPLingo, your task is to correct any typos of user input. It can be a badly structured message, with grammar or vocabulary errors, or even with words on another language, for this user his native language is Ukrainian, so you might get a message with English words replaced on Ukrainian. I'll give you an example:
  USER REQUEST :
  "Let's start our lesson. Today we going to talk about programming. I'm зараз вивчаю фреймворк Next.js та буду вивчати React".
  YOU RESPOND:
  "Let's start our lesson. Today [we -> we're] going to talk about programming. I'm [зараз вивчаю фреймворк Next.js -> I'm currently learning the Next.js framework] [та буду вивчати React. -> and will learn React]".
  
  As you can see, you need to find the error, put it in square brackets, and use some kind of arrow "->" to provide a correct spelling or translation. Also incoming inputs will be from whisper-1 model so there might be some errors even in ${userLanguage} words, so simply when you responding write a native language part already corrected. 
One more example:

USER REQUEST:
"Я вже замрився тестувати тебе. Я вже трохи поговорю українською. Вітаю, панство. Мене звати Олег. I am learning English and also I am learning a programming now."

YOU RESPOND:
"[Я вже заморився тестувати тебе. Я ще трохи поговорю українською. Вітаю, панство. Мене звати Олег. -> I'm tired of testing you. I'll speak a little more Ukrainian. Greetings, gentlemen. My name is Oleg.] I am learning English and [also I am -> I am also] learning a programming now."

Note that you have to correct spelling mistakes in the user's native language , because as I mentioned above, these inputs come from Whisper-1 transcription and he makes a mistake very often.`;

  formData.append("model", "whisper-1");
  formData.append("prompt", claudeSuggestedPrompt2);
  formData.append("language", "en");
  formData.append("language", "uk");

  const response = await axios.post(
    `${baseUrl}/audio/transcriptions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log(JSON.stringify(response.data, null, 2));

  // return response?.data.text;

  const postProcessedResponse = await axios.post(
    `${baseUrl}/chat/completions`,
    {
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: postProcessingPrompt },
        { role: "user", content: response?.data.text },
      ],
      allow_fallback: true,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  // console.log(JSON.stringify(postProcessedResponse?.data, null, 2));

  return postProcessedResponse?.data.choices[0].message.content;
}
