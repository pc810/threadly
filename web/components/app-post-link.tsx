"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePostLink } from "@/query/post.query";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { AppImageMedia } from "@/components/app-image-media";

export const AppPostLink = ({ post }: { post: Post }) => {
  const { data, isLoading } = usePostLink(post.id);

  if (isLoading || data == null) return <>Loading</>;

  return (
    <>
      <Button variant="link" asChild>
        <Link href={post.link} className="flex gap-0.5 items-center">
          <Link2 />
          {post.link}
        </Link>
      </Button>
      <Link
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-lg"
      >
        <Card className="p-1.5 gap-2">
          <CardHeader className="px-2">
            <CardTitle className="text-balance">{data.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {data.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative aspect-square max-h-[min(100%,540px)] min-h-[220px] p-0 overflow-hidden rounded-xl">
            <AppImageMedia
              mediaId={data.mediaId}
              className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-100 scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/5 to-black/30" />

            <AppImageMedia
              mediaId={data.mediaId}
              className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-xl"
            />
          </CardContent>
        </Card>
      </Link>
    </>
  );
};
