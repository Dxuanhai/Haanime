"use client";

import { User, Settings, LogOut, ArrowBigRight } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const PersonalProfile = ({ profile }: { profile: Profile }) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const options = [
    {
      id: 1,
      label: "Profile",
      icon: <User className="w-4 h-4" />,
      fn: () => onOpen("edit-profile", { profile }),
    },
    {
      id: 2,
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      fn: () => onOpen("edit-profile", { profile }),
    },
    {
      id: 3,
      label: "Isekai",
      icon: <ArrowBigRight className="w-4 h-4" />,
      fn: () => onOpen("explore-servers"),
    },
    {
      id: 4,
      label: "Logout",
      icon: <LogOut className="w-4 h-4" />,
      fn: () => signOut(() => router.push("/")),
    },
  ];
  const { onOpen } = useModal();

  function handleClick() {
    document.querySelector(".modal_user")?.classList.toggle("hidden");
  }

  return (
    <div>
      <ActionTooltip side="right" align="center" label="your profile">
        <div>
          <div
            onClick={handleClick}
            className={cn(
              "relative user_profile cursor-pointer group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden"
            )}
          >
            <Image fill src={profile.imageUrl} alt={profile.name} />
          </div>
        </div>
      </ActionTooltip>
      <ul className="modal_user rounded-md  hidden flex-col bg-gradient-to-bl from-slate-500 via-white to-slate-400 dark:from-indigo-900 dark:via-slate-600 dark:to-gray-950 fixed bottom-3 left-[72px]">
        {options.map((item) => {
          return (
            <li
              onClick={item.fn}
              key={item.id}
              className="py-3 px-6 flex justify-between items-center gap-x-4 cursor-pointer hover:opacity-50"
            >
              {item.label} {item.icon}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
