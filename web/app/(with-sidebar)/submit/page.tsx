"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUpload,
} from "@/components/ui/file-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const postSchema = z.object({
  community: z.string().min(1, "Please select a community"),
  type: z.enum(["text", "media", "link"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional().nullable(),
  media: z
    .any()
    .optional()
    .refine(
      (files) => !files || (Array.isArray(files) && files.length <= 3),
      "You can upload up to 3 files"
    ),
  link: z
    .union([z.literal(""), z.string().url("Enter a valid URL")])
    .optional()
    .nullable(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function Page() {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      community: "",
      type: "text",
      title: "",
      media: [],
      link: "",
    },
  });

  const postType = form.watch("type");

  function onSubmit(values: PostFormValues) {
    console.log(values);
    // handle submit logic
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold pt-6 pb-4">Create Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="community"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="u/Any_Yellow_123">
                      u/Any_Yellow_123
                    </SelectItem>
                    <SelectItem value="r/react">r/react</SelectItem>
                    <SelectItem value="r/nextjs">r/nextjs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="media">Images & Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {postType === "text" && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          {postType == "text" && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Write your post content..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* {postType === "media" && (
            <FormField
              control={form.control}
              name="media"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Upload Media</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}
          {postType === "media" && (
            <FormField
              control={form.control}
              name="media"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Upload Media</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={value || []}
                      onValueChange={(files) => onChange(files)}
                      accept="image/*,video/*"
                      multiple
                      onUpload={async (
                        files,
                        { onProgress, onSuccess, onError }
                      ) => {
                        // Optional: upload logic (to API / S3 / Strapi)
                        // Simulated example
                        for (const file of files) {
                          try {
                            onProgress(file, 50);
                            await new Promise((r) => setTimeout(r, 1000));
                            onSuccess(file);
                          } catch (err) {
                            onError(file, err as Error);
                          }
                        }
                      }}
                    >
                      <FileUploadDropzone className="border border-dashed rounded-md p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Drag & drop files here or click to browse
                        </p>
                      </FileUploadDropzone>

                      <FileUploadList className="mt-3 space-y-2">
                        {value?.map((file: File) => (
                          <FileUploadItem key={file.name} value={file}>
                            <div className="flex items-center gap-3">
                              <FileUploadItemPreview />
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {postType === "link" && (
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="mt-4">
            Post
          </Button>
        </form>
      </Form>
    </div>
  );
}
