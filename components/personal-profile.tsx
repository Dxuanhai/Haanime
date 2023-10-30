"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "./user-avatar";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const PersonalProfile = ({ profile }: { profile: Profile }) => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="your profile">
        <div onClick={() => onOpen("edit-profile", { profile })}>
          <div
            className={cn(
              "relative cursor-pointer group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden"
            )}
          >
            <Image fill src={profile.imageUrl} alt={profile.name} />
          </div>
        </div>
      </ActionTooltip>
    </div>
  );
};
