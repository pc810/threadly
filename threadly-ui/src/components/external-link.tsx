type ExternalLinkProps = React.ComponentProps<"a"> & {
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

	return <a href={link} target="_blank" rel="noopener noreferrer" {...props} />;
}
