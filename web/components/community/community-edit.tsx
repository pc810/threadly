"use client";

import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Community,
  pickDirty,
  UpdateCommunityMetaDTO,
  updateCommunityMetaDTOSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCommunity } from "@/query/community.query";
import { useState } from "react";
import { fa } from "zod/v4/locales";

export const CommunityEdit = ({ community }: { community: Community }) => {
  const [open, setOpen] = useState(false);

  const updateCommunityQuery = useUpdateCommunity(community.id, community.name);

  const form = useForm<UpdateCommunityMetaDTO>({
    resolver: zodResolver(updateCommunityMetaDTOSchema),
  });

  const handleOpenChange = (v: boolean) => {
    if (v)
      form.reset({
        title: community.title,
        description: community.description,
        isNsfw: community.nsfw,
      });
    setOpen(v);
    if (!v)
      form.reset({
        title: undefined,
        description: undefined,
        isNsfw: undefined,
      });
  };

  const {
    formState: { dirtyFields },
  } = form;

  const onSubmit = async (values: UpdateCommunityMetaDTO) => {
    const patchPayload = pickDirty(values, dirtyFields);
    await updateCommunityQuery.mutateAsync(patchPayload);

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          <Edit />
          <div className="sr-only">Edit community</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit community details wid get</DialogTitle>
        <DialogDescription>
          Briefly describes your community and members. Always appears at the
          top of the sidebar.
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your community..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isNsfw"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Mark as NSFW (18+)</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={updateCommunityQuery.isPending}>
              {updateCommunityQuery.isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
