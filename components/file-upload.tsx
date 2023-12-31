"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { toast } from "./ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  type?: "bg" | "img" | undefined | null;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
  type,
}: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && type === "img" && fileType !== "pdf") {
    return (
      <div className="relative w-[100px] h-[100px]">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value && !type && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && type === "bg" && fileType !== "pdf") {
    return (
      <div className="relative h-[200px] w-[450px] bg-center bg-cover bg-no-repeat">
        <Image fill src={value} alt="Upload" className="rounded-sm" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-sm absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <UploadDropzone
        className={` ${type === "bg" && "w-[450px]"} ${
          type === "img" && "w-[250px]  rounded-full"
        } dark:text-white text-slate-800  dark:bg-gradient-to-tb dark:from-gray-900 dark:to-gray-600 bg-gradient-to-bl from-gray-100 to-gray-300 border-2 border-none`}
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast({
            variant: "destructive",
            title: `${error.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }}
      />
    </>
  );
};
