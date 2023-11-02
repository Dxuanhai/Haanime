"use client";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Profile } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  profile_user: Profile;
  params?: { serverId: string; channelId: string };
}

export const MediaRoom = ({
  chatId,
  video,
  audio,
  profile_user,
  params,
}: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  const handleConnected = async () => {
    try {
      await axios.post(`/api/socket/channels/${params?.channelId}`, {
        profileId: profile_user.id,
        serverId: params?.serverId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();

        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }
  const handleLeaveRoom = async () => {
    try {
      await axios.delete(
        `/api/socket/userInRoom/${profile_user.id}?serverId=${params?.serverId}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onDisconnected={() => handleLeaveRoom()}
      onConnected={() => handleConnected()}
      className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-500 via-white to-slate-200 dark:from-indigo-900 dark:via-slate-600 dark:to-gray-950"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
