import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { HotkeysProvider } from "react-hotkeys-hook";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<HotkeysProvider>
				<NuqsAdapter>
					<TooltipProvider>
						{children}
						<Toaster />
					</TooltipProvider>
				</NuqsAdapter>
			</HotkeysProvider>
		</ThemeProvider>
	);
};
