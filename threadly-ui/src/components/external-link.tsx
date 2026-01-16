import { addUtmParams } from "@/lib/format";

type ExternalLinkProps = React.ComponentProps<"a"> & {
	extraParams?: Record<string, string>;
	utmId?: string;
};

export function ExternalLink({
	href,
	extraParams,
	utmId,
	...props
}: ExternalLinkProps) {
	const link = addUtmParams(String(href), {
		utm_content: "post_link",
		...(utmId ? { utm_id: utmId } : {}),

		...(extraParams ?? {}),
	});

	return <a href={link} target="_blank" rel="noopener noreferrer" {...props} />;
}
