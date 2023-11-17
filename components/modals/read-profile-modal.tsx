"use client";

import { useModal } from "@/hooks/use-modal-store";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

export const ReadProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "read-profile";
  const { profile } = data;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className=" p-0 overflow-hidden w-full ">
        <div className="flex flex-col w-full  px-0">
          <Image
            src={profile?.bgUrl || "/emptyyy.jpg"}
            alt={profile?.bgUrl || "background"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-[250px]"
          />
          <Image
            src={profile?.imageUrl || ""}
            alt={profile?.imageUrl || "avatar"}
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-full relative -translate-y-1/2 w-[150px] h-[150px] border-4 object-cover left-1"
          />
          <p className="px-6 h-[150px] -mt-[50px]">{profile?.bio}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
