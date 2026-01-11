import { Spinner } from "./ui/spinner";

export const AppLoader = () => (
	<div className="fixed size-full top-0 left-0 grid place-content-center text-center justify-center text-xs">
		<Spinner className="size-6 mx-auto mb-2" />
		Loading
	</div>
);
