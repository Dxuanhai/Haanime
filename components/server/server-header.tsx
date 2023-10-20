"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const [toogle, setToggle] = useState(false);
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const handleDropdownMenu = () => {
    setToggle(!toogle);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none"
        asChild
        onClick={() => handleDropdownMenu()}
      >
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition dark:text-white text-slate-800">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      {toogle && (
        <nav className="dark:bg-slate-900 transition-all ">
          {isModerator && (
            <div
              onClick={() => onOpen("invite", { server })}
              className="text-indigo-600 dark:text-indigo-400 px-3 py-3 cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700  "
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </div>
          )}
          {isAdmin && (
            <div
              onClick={() => onOpen("editServer", { server })}
              className="px-3 py-3 text-sm cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700 "
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </div>
          )}
          {isAdmin && (
            <div
              onClick={() => onOpen("members", { server })}
              className="px-3 py-3 text-sm cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700 "
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </div>
          )}
          {isModerator && (
            <div
              onClick={() => alert("moderator")}
              className="px-3 py-3 text-sm cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700 "
            >
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </div>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <div className="dark:text-rose-500 text-red-500 font-bold px-3 py-3 text-sm cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700 ">
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </div>
          )}
          {!isAdmin && (
            <div className="dark:text-rose-500 text-red-500  font-bold px-3 py-3 text-sm cursor-pointer flex items-center text-md hover:bg-slate-200 hover:dark:bg-slate-700 ">
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </div>
          )}
        </nav>
      )}
    </DropdownMenu>
  );
};
