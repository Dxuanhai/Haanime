"use client";

import {
  Channel,
  ChannelType,
  MemberRole,
  Profile,
  Server,
  UserInRoom,
} from "@prisma/client";
import { Plus, Settings } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ServerChannel } from "./server-channel";
import { useSocket } from "../providers/socket-provider";

import { useEffect, useState } from "react";

type usersInRoomType =
  | ({
      profile: Profile;
    } & {
      id: string;
      channelId: string;
      profileId: string;
    })[]
  | undefined;
interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
  dataChannels?: Channel[];
  serverData: Server;
  userInRoomStatic?: usersInRoomType;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
  dataChannels,
  serverData,
  userInRoomStatic,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  const { socket } = useSocket();
  const [usersInRoom, setUsersInRoom] =
    useState<usersInRoomType>(userInRoomStatic);

  useEffect(() => {
    if (!socket) {
      return;
    }
    try {
      socket.on("channel", (items: usersInRoomType) => {
        setUsersInRoom(items);

        //});
      });
    } catch (error) {
      console.log(error);
    }
  }, [socket]);

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() => onOpen("createChannel", { channelType })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage Members" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Settings className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      </div>
      <div className="space-y-[2px]">
        {dataChannels &&
          dataChannels.map((channel) => {
            const specificUsers =
              usersInRoom &&
              usersInRoom?.filter((user) => user.channelId === channel.id);
            return (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={serverData}
                userInRoom={specificUsers}
              />
            );
          })}
      </div>
    </>
  );
};
