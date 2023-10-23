"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-gradient-to-tl from-yellow-400 via-orange-300 to-yellow-500 text-white border-none"
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-gradient-to-r from-green-400 via-green-400 to-green-500 text-white border-none"
    >
      Connect successfully
    </Badge>
  );
};
