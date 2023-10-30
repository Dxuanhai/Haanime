"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect } from "react";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required.",
  }),
  imageUrl: z.string(),
  bgUrl: z.string().optional(),
  bio: z.string().optional(),
});

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "edit-profile";
  const { profile } = data;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      bgUrl: "",
      bio: "",
    },
  });
  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name);
      form.setValue("imageUrl", profile.imageUrl);
      form.setValue("bgUrl", profile?.bgUrl || "");
      form.setValue("bio", profile?.bio || "");
    }
  }, [profile, form]);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch("/api/profile", {
        id: profile?.id,
        name: values.name,
        bio: values.bio,
        imageUrl: values.imageUrl,
        bgUrl: values.bgUrl,
      });
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className=" p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your profile
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <FormField
                  control={form.control}
                  name="bgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                          type="bg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-start gap-x-6 mt-2">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                            type="img"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start gap-x-2">
                        <FormLabel className="uppercase text-xs font-bold ">
                          userName
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 dark:bg-slate-600 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter world name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full gap-3">
                      <FormLabel className="text-base font-semibold text-light-2">
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4">
              <Button variant="ghost" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
