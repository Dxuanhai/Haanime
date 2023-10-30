"use client";
import {
  AudioConference,
  Chat,
  TrackMutedIndicator,
  TrackToggle,
} from "@livekit/components-react";
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
      <MyVideoConference profile_user={profile_user} video={video} />
    </LiveKitRoom>
  );
};

function MyVideoConference({
  profile_user,
  video,
}: {
  profile_user: Profile;
  video: boolean;
}) {
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
    <>
      {video ? (
        <VideoConference />
      ) : (
        <>
          <GridLayout
            tracks={tracks}
            style={{
              height: "80vh ",
            }}
            className="m-auto"
          >
            <div
              className="w-full h-full flex justify-center items-center bg-center bg-no-repeat bg-cover relative rounded-md"
              style={
                profile_user && {
                  backgroundImage: `url(${profile_user.bgUrl})`,
                }
              }
            >
              <Image
                src={profile_user.imageUrl}
                alt={profile_user.name}
                className=" rounded-full bg-center bg-no-repeat bg-cover absolute"
                width={200}
                height={200}
              />
              <div className="left-[5px] bottom-[5px] z-10 absolute flex justify-center items-center gap-2 py-1 px-2 rounded-md dark:bg-zinc-600 dark:text-slate-50 bg-zinc-300 text-slate-800">
                <h3 className="">{profile_user.name}</h3>
                <TrackToggle
                  source={Track.Source.Microphone}
                  className="bg-slate-300"
                />
              </div>
            </div>
          </GridLayout>

          <RoomAudioRenderer />
        </>
      )}
    </>
  );
}
