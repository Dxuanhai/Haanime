import { MessageSquare } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-btn";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 ">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <MessageSquare className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="flex ml-4 items-center">
        <SocketIndicator />
      </div>
      <div className="flex items-center justify-center ml-auto">
        {type === "conversation" && <ChatVideoButton />}
      </div>
    </div>
  );
};
