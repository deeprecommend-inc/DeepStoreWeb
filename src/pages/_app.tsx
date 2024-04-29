import { defaultTheme } from "@/lib/defaultTheme";
import { TokenContext } from "@/lib/session";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";



export default function App({
	Component, pageProps: { ...pageProps }
}: AppProps) {
	const [_token, _setToken] = useState<string | null>(null);
	
	// localStorageに保存したtokenを読み出す
	useEffect(() => {
		_setToken(localStorage.getItem("token") || null);
	}, []);

	// tokenが変更されたらlocalStorageの方も書き換える
	const setToken = (newToken: string | null) => {
		localStorage.setItem("token", newToken || "");
		_setToken(newToken);
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<TokenContext.Provider value={{token: _token, setToken}}>
				<Component {...pageProps} />
			</TokenContext.Provider>
		</ThemeProvider>
	);
}