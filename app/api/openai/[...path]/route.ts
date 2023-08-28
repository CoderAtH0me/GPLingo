interface Chunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content: string;
    };
    finish_reason: string;
  }>;
}
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GPT_API_KEY;
const API_BASE = process.env.BASE_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const parsedReq = await request.json();
    const { data } = parsedReq;
    const { message, systemPrompt } = data;

    console.log(`[DATA]" ${data}`);
    const shouldStream = false;

    let finalRes = "";
    // let response: AxiosResponse;
    if (data) {
      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          // stream: shouldStream,
          allow_fallback: true,
        }),
      });

      if (shouldStream) {
        // const reader = response.body?.getReader();
        // let decoder = new TextDecoder("utf-8");
        // let done = false;
        // while (!done) {
        //   // if (!reader) return;
        //   const { value, done: streamDone } = await reader!.read();
        //   if (streamDone) {
        //     break;
        //   }
        //   const lines = decoder.decode(value).split("\n");
        //   console.log(lines);
        //   for (const line of lines) {
        //     if (line.startsWith("data: ")) {
        //       const eventData = line.slice(6);
        //       if (eventData === "[DONE]") {
        //         done = true;
        //         break;
        //       } else {
        //         const json = JSON.parse(eventData);
        //         const delta = json.choices?.[0]?.delta.content;
        //         if (delta) {
        //           finalRes += delta;
        //         }
        //       }
        //     }
        //   }
        // }
        // return NextResponse.json(finalRes);
      } else {
        console.log(`[RUNNING NOSTREAM]`);

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          return NextResponse.json(data);
        }

        return NextResponse.json("STANDATD OUTPUS");
      }
    }
  } catch (error) {
    console.error("ROUTE ERROR:", error);
  }

  return new Response("something went wrong", { status: 500 });
}

// async function callOpenAI(retries = 3, delay = 1000) {
//   const API_KEY = process.env.OPENAI_API_KEY;
//   const FETCH_URL = "https://api.openai.com/v1/chat/completions";

//   try {
//     const response = await axios.post(
//       FETCH_URL,
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are a helpful assistant.",
//           },
//           {
//             role: "user",
//             content: "Hello!",
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${API_KEY}`,
//         },
//       }
//     );

// return response;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error?.response?.status === 429) {
//       if (retries > 0) {
//         await new Promise((resolve) => setTimeout(resolve, delay));
//         return callOpenAI(retries - 1, delay * 2);
//       }
//     }

//     throw error;
//   }
// }

//////////////////////////////////////
//   try {
//     const response = await callOpenAI();
//     console.log(response);
//     return NextResponse.json(response);
//   } catch (error) {
//     console.error(error);
//     return new Response("Internal Server Error", { status: 500 });
//   }

///////////////////////////////////////////////////

//   const parsedReq = await request.json();
//   const { data } = parsedReq;

//   try {
//     const response = await axios.post(
//       `${API_BASE}/chat/completion`,
//       {
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "test" }],
//         allow_fallback: true,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${API_KEY}`,
//         },
//       }
//     );

//     console.log(response.data);
//     if (response.data) return NextResponse.json(response.data);
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(error);
//   }
