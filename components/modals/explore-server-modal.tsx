"use client";
import { useState } from "react";
import { Server } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const ExploreServers = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const [servers, setServers] = useState<Server[]>([]);

  const isModalOpen = isOpen && type === "explore-servers";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Come to another world
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3  gap-4">
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
          <div className="flex flex-col gap-y-3 py-4 justify-center items-center rounded-md border-2 border-stone-300">
            <UserAvatar src="/kanna.jpg" className="md:h-20 md:w-20" />
            <h3 className="text-center">Kanna Server</h3>
            <Separator />
            <Button variant="secondary">Isekai</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
