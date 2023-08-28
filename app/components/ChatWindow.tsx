"use client";

import axios from "axios";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { useState } from "react";

const messages = ["hello world", "I'm here", "how are you?"];

export type MessageType = {
  role: string;
  content: string;
};

export type Choice = {
  index: number;
  message: MessageType;
  finish_reason: string;
};

const ChatWindow = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (message: string, systemPrompt: string) => {
    console.log(message);
    const id = "123456";
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/openai/${id}`, {
        data: {
          message: message,
          systemPrompt: systemPrompt,
        },
      });

      console.log(response.data.choices[0]?.message.content);
      // const { choices } = response.data;
      // choices.forEach((element: Choice) => {
      //   console.log(element.message.content);
      // });
      if (response.status === 200) setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-[100dvh] w-full flex flex-col justify-between">
        <ChatHeader />
        <div className="w-full flex-auto">
          {messages.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center p-4 border-b border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <p className="text-gray-600">{item}</p>
                </div>
              </div>
            );
          })}
        </div>
        <ChatFooter onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ChatWindow;
