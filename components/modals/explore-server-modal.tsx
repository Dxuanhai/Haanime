"use client";
import { useEffect, useState } from "react";
import { Server, Member } from "@prisma/client";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "@/components/user-avatar";
import { DoorOpen, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import axios from "axios";

export const ExploreServers = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type } = useModal();
  const [servers, setServers] = useState<
    {
      id: string;
      name: string;
      imageUrl: string;
      inviteCode: string;
      profileId: string;
      createdAt: Date;
      updatedAt: Date;
      members: Member[];
    }[]
  >();

  const isModalOpen = isOpen && type === "explore-servers";

  const johnServer = async (serverID: string) => {
    try {
      await axios.post(`/api/members`, { serverId: serverID });
      router.push(`/servers/${serverID}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch("/api/servers");
        const data = await res.json();
        setServers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServers();
  }, []);
  return (
    <CommandDialog open={isModalOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Discover the world you want to isekai \ . /" />
      <CommandList>
        <CommandEmpty>No Results found</CommandEmpty>
        <CommandGroup heading="All Worlds" className="">
          {servers &&
            servers.length > 0 &&
            servers.map((item) => (
              <>
                <CommandItem
                  className="cursor-pointer flex py-4 relative justify-between items-center rounded-md  group  hover:opacity-100"
                  key={item?.id}
                >
                  <div className="flex gap-x-5 items-center justify-start h-full ">
                    <UserAvatar
                      src={item.imageUrl}
                      className="md:h-20 md:w-20"
                    />
                    <div className="flex flex-col h-full">
                      <i className="text-center font-bold text-slate-800 dark:text-slate-50 ">
                        {item.name}
                      </i>
                      <div className="bottom-1 absolute flex gap-x-3">
                        <span className="text-[12px]">
                          {item.members.length}
                        </span>
                        <Users2Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => johnServer(item.id)}
                    variant="ghost"
                    className="hidden group-hover:flex  gap-x-3"
                  >
                    Accept isekai <DoorOpen className="w-4 h-4" />
                  </Button>
                </CommandItem>
                <Separator />
              </>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
