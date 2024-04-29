import { SessionProvider } from "next-auth/react"
import { defaultTheme } from "@/lib/defaultTheme";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";

export default function App({
	Component, pageProps: { session, ...pageProps }
}: AppProps) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ThemeProvider>
	)
}