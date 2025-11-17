import { useMedia } from "@/query/media.query";

type AppImageMediaProps = React.ComponentProps<"img"> & {
  mediaId: string;
};

export const AppImageMedia = ({ mediaId, ...props }: AppImageMediaProps) => {
  const { data, isLoading } = useMedia(mediaId);

  if (isLoading || data == null) return null;

  return (
    <img
      src={data.src}
      width={data.width}
      height={data.height}
      alt=""
      {...props}
    />
  );
};
