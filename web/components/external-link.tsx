import Link from "next/link";

type ExternalLinkProps = React.ComponentProps<typeof Link> & {
  extraParams?: Record<string, string>;
  utmId?: string;
};

export function addUtmParams(url: string, params: Record<string, string>) {
  const u = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    u.searchParams.set(key, value);
  });

  return u.toString();
}

export function ExternalLink({
  href,
  extraParams,
  utmId,
  ...props
}: ExternalLinkProps) {
  const link = addUtmParams(String(href), {
    utm_source: "threadly",
    utm_medium: "post",
    ...(utmId ? { utm_id: utmId } : {}),

    ...(extraParams ?? {}),
  });

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" {...props} />
  );
}
