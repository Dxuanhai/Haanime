"use client";

import {
  Channel,
  ChannelType,
  MemberRole,
  Profile,
  Server,
} from "@prisma/client";
import { Edit, MessageSquare, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useEffect } from "react";
import axios from "axios";
import { UserAvatar } from "../user-avatar";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
  userInRoom?: ({
    profile: {
      id: string;
      userId: string;
      name: string;
      imageUrl: string;
      bgUrl: string | null;
      bio: string | null;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  } & {
    id: string;
    channelId: string;
    profileId: string;
  })[];
}

const iconMap = {
  [ChannelType.TEXT]: MessageSquare,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
  userInRoom,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-gray-700 transition mb-1",
          params?.channelId === channel.id &&
            "opacity-80  bg-zinc-700/10 dark:bg-gray-700"
        )}
      >
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit
                onClick={(e) => onAction(e, "editChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={(e) => onAction(e, "deleteChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
      {userInRoom &&
        userInRoom.map((item) => {
          return (
            <div
              key={item.id}
              className="mx-4  flex gap-x-4 py-2 items-center justify-start hover:opacity-70 cursor-pointer "
            >
              <UserAvatar
                src={item.profile.imageUrl}
                className="md:h-7 md:w-7"
              />
              <span className="text-slate-900 dark:text-zinc-200 text-sm">
                {item.profile.name}
              </span>
            </div>
          );
        })}
    </>
  );
};
