"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { MessageSquare, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useRef, useState } from "react";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
  profile: Profile;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ServerMember = ({
  member,
  server,
  profile,
}: ServerMemberProps) => {
  const { onOpen } = useModal();
  const [toggle, setToggle] = useState(false);

  const wrapperRef = useRef<HTMLUListElement>(null); // Ref for the button wrapper

  const handleClickOutside = (event: any) => {
    // Close toggle if the clicked element is outside the component

    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      console.log("oek");
      setToggle(false);
    }
  };

  useEffect(() => {
    // Attach event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Detach event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      icon: <MessageSquare className="w-4 h-4" />,
      fn: () =>
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`),
    },
  ];
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onContextMenu = (event: any) => {
    // Handle right-click event logic here
    event.preventDefault(); // Prevent the default context menu from appearing
    setToggle(!toggle);
  };

  return (
    <>
      <button
        onClick={() => setToggle(!toggle)}
        onContextMenu={onContextMenu}
        className={cn(
          "group px-2 py-2  relative rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
      >
        <UserAvatar
          src={member.profile.imageUrl}
          className="h-8 w-8 md:h-8 md:w-8"
        />
        <p
          className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id &&
              "text-primary  dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {member.profile.name}
        </p>
        {icon}
        {toggle && (
          <ul
            ref={wrapperRef}
            className="rounded-md  flex flex-col dark:bg-gradient-to-tl dark:from-gray-900 dark:to-gray-700 bg-gradient-to-bl from-gray-100 to-gray-300 absolute -top-2 right-0 z-20"
          >
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
        )}
      </button>
    </>
  );
};
