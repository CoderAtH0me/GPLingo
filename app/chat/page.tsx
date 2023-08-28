import ChatWindow from "../components/ChatWindow";
import SidePanel from "../components/SidePanel";

import dynamic from "next/dynamic";

// const ChatWindow = dynamic(() => import("../components/ChatWindow"), {
//   loading: () => <p>Loading...</p>,
//   ssr: false,
// });

export default function Chat() {
  return (
    <>
      <main className="flex flex-row h-[100dvh] ">
        <SidePanel />
        <ChatWindow />
      </main>
    </>
  );
}
