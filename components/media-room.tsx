"use client";

import { useEffect, useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel, Profile } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Track } from "livekit-client";
import Image from "next/image";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  profile_user: Profile;
}

export const MediaRoom = ({
  chatId,
  video,
  audio,
  profile_user,
}: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

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
  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-500 via-white to-slate-200 dark:from-indigo-900 dark:via-slate-600 dark:to-gray-950"
    >
      <MyVideoConference profile_user={profile_user} />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
};

function MyVideoConference({ profile_user }: { profile_user: Profile }) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{
        height: "calc(90vh - var(--lk-control-bar-height))",
      }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <div
        className="w-full h-full flex justify-center items-center bg-center bg-no-repeat bg-cover"
        style={profile_user && { backgroundImage: `url(/kanna.jpg)` }}
      >
        <Image
          src={profile_user.imageUrl}
          alt={profile_user.name}
          className=" rounded-full bg-center bg-no-repeat bg-cover"
          width={200}
          height={200}
        />
      </div>
    </GridLayout>
  );
}
